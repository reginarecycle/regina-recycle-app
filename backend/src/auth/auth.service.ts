import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/notifications/email/email.service';
import { ErrorMessage } from 'src/common/error-message';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(ErrorMessage.EMAIL_TAKEN);
    }

    if (dto.role === 'COLLECTOR') {
      if (!dto.licenseId) {
        throw new BadRequestException(ErrorMessage.LICENSE_ID_REQUIRED);
      }

      const existingLicense = await this.prisma.collectorProfile.findUnique({
        where: { licenseId: dto.licenseId },
      });

      if (existingLicense) {
        throw new ConflictException(ErrorMessage.LICENSE_ID_TAKEN);
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        emailVerified: false,
        // agreedToTerms: dto.agreedToTerms,          
        // agreedToTermsAt: new Date(),

        ...(dto.role === 'CUSTOMER' &&
          dto.dateOfBirth && {
            customerDOB: {
              create: { dob: new Date(dto.dateOfBirth) },
            },
          }),

        ...(dto.role === 'COLLECTOR' && {
          collectorProfile: {
            create: {
              licenseId: dto.licenseId!,
              serviceFee: dto.serviceFee || 10.0,
              bulkIncentiveEnabled: false,
              bulkThreshold: 100,
            },
          },
        }),
      },
      include: {
        customerDOB: true,
        collectorProfile: true,
      },
    });

    const verificationToken = this.generateVerificationToken(user.userId, user.email);

    try {
      await this.emailService.sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    this.emailService.sendWelcomeEmail(user.email, user.name, user.role).catch(console.error);

    const token = this.generateAccessToken(user.userId, user.email, user.role);

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        customerDOB: true,
        collectorProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.INVALID_USER_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessage.INVALID_USER_CREDENTIALS);
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(ErrorMessage.ACCOUNT_INACTIVE);
    }

    const token = this.generateAccessToken(user.userId, user.email, user.role);

    return {
      message: 'Login successful',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      token,
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'email-verification') {
        throw new BadRequestException(ErrorMessage.TOKEN_TYPE_INVALID);
      }

      const user = await this.prisma.user.findUnique({
        where: { userId: payload.sub },
      });

      if (!user) {
        throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      }

      if (user.emailVerified) {
        return { message: ErrorMessage.EMAIL_ALREADY_VERIFIED };
      }

      await this.prisma.user.update({
        where: { userId: user.userId },
        data: { emailVerified: true },
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(ErrorMessage.TOKEN_EXPIRED_VERIFICATION);
      }
      throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
    }
  }

  async resendOTP(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    if (user.emailVerified) {
      throw new BadRequestException(ErrorMessage.EMAIL_ALREADY_VERIFIED);
    }

    const verificationToken = this.generateVerificationToken(user.userId, user.email);

    await this.emailService.sendVerificationEmail(user.email, verificationToken, user.name);

    return { message: 'Verification email sent' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: 'If that email is registered, a reset link has been sent.' };
    }

    const resetToken = this.generatePasswordResetToken(user.userId, user.email);

    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new BadRequestException(ErrorMessage.EMAIL_SEND_FAILED);
    }

    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset') {
        throw new BadRequestException(ErrorMessage.TOKEN_TYPE_INVALID);
      }

      const user = await this.prisma.user.findUnique({
        where: { userId: payload.sub },
      });

      if (!user) {
        throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { userId: user.userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(ErrorMessage.TOKEN_EXPIRED_RESET);
      }
      throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessage.PASSWORD_INVALID);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        customerDOB: { select: { dob: true } },
        collectorProfile: {
          select: {
            licenseId: true,
            serviceFee: true,
            bulkIncentiveEnabled: true,
            bulkThreshold: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    return user;
  }

  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign(
      { sub: userId, email, role, type: 'access' },
      { expiresIn: '7d' },
    );
  }

  private generateVerificationToken(userId: string, email: string) {
    return this.jwtService.sign(
      { sub: userId, email, type: 'email-verification' },
      { expiresIn: '24h' },
    );
  }

  private generatePasswordResetToken(userId: string, email: string) {
    return this.jwtService.sign(
      { sub: userId, email, type: 'password-reset' },
      { expiresIn: '1h' },
    );
  }
}