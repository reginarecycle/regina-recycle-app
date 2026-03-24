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
import { EmailService } from '../notifications/email/email.service';
import { ErrorMessage } from '../common/error-message';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}


  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException(ErrorMessage.EMAIL_TAKEN);
    }

    // Validate collector-specific fields
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

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        role: dto.role,
        emailVerified: false,
        agreedToTerms: true,
        agreedToTermsAt: new Date(),

        addresses: {
          create: {
            line1: dto.address.line1,
            line2: dto.address.line2,
            city: dto.address.city,
            province: dto.address.province,
            postalCode: dto.address.postalCode,
            latitude: dto.address.latitude,
            longitude: dto.address.longitude,
            isPrimary: true,
          },
        },

        // Create customer DOB if customer and provided
        ...(dto.role === 'CUSTOMER' &&
          dto.dateOfBirth && {
            customerDOB: {
              create: { dob: new Date(dto.dateOfBirth) },
            },
          }),

        // Create collector profile if collector
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

    const otp = this.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000); 
    const hashedOtp = await bcrypt.hash(otp, 10);


    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        emailOtp: hashedOtp,
        emailOtpExpiresAt: otpExpiresAt,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user.email, otp, user.name, user.role);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Send welcome email (non-blocking)
    // this.emailService.sendWelcomeEmail(user.email, user.name, user.role).catch(console.error);

    return {
      message: 'Registration successful. Please check your email for your verification code.',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
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

  async verifyEmail({ email, otp }: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
  
    if (user.emailVerified) {
      return { message: ErrorMessage.EMAIL_ALREADY_VERIFIED };
    }
  
    if (!user.emailOtp || !user.emailOtpExpiresAt) {
      throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
    }
  
    if (new Date() > user.emailOtpExpiresAt) {
      throw new BadRequestException(ErrorMessage.TOKEN_EXPIRED_VERIFICATION);
    }
  
    const isOtpValid = await bcrypt.compare(otp, user.emailOtp);
  
    if (!isOtpValid) {
      throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
    }
  
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        emailVerified: true,
        emailOtp: null,
        emailOtpExpiresAt: null,
      },
    });
  
    this.emailService.sendWelcomeEmail(user.email, user.name, user.role).catch(console.error);
  
    return { message: 'Email verified successfully' };
  }
  async resendOTP(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
  
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
  
    if (user.emailVerified) {
      throw new BadRequestException(ErrorMessage.EMAIL_ALREADY_VERIFIED);
    }
  
    const otp = this.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
    const hashedOtp = await bcrypt.hash(otp, 10);
  
    // ✅ save to DB first
    await this.prisma.user.update({
      where: { userId: user.userId },
      data: {
        emailOtp: hashedOtp,
        emailOtpExpiresAt: otpExpiresAt,
      },
    });
  
    await this.emailService.sendVerificationEmail(user.email, otp, user.name, user.role);
  
    return { message: 'Verification code sent' };
  }


async forgotPassword(email: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Don't reveal if email exists
    return { message: 'If that email is registered, a reset code has been sent.' };
  }

  // ✅ Generate OTP
  const otp = this.generateOTP();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  const hashedOtp = await bcrypt.hash(otp, 10);

  await this.prisma.user.update({
    where: { userId: user.userId },
    data: {
      passwordOtp: hashedOtp,
      passwordOtpExpiresAt: otpExpiresAt,
    },
  });

  try {
    await this.emailService.sendPasswordResetEmail(user.email, otp, user.name, user.role);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new BadRequestException(ErrorMessage.EMAIL_SEND_FAILED);
  }

  return { message: 'If that email is registered, a reset code has been sent.' };
}


async resetPassword(email: string, otp: string, newPassword: string) {
  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
  }

  if (!user.passwordOtp || !user.passwordOtpExpiresAt) {
    throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
  }

  // Check if OTP expired
  if (new Date() > user.passwordOtpExpiresAt) {
    throw new BadRequestException(ErrorMessage.TOKEN_EXPIRED_RESET);
  }

  const isOtpValid = await bcrypt.compare(otp, user.passwordOtp);

  if (!isOtpValid) {
    throw new BadRequestException(ErrorMessage.TOKEN_INVALID);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: hashedPassword,
      passwordOtp: null,
      passwordOtpExpiresAt: null,
    },
  });

  return { message: 'Password reset successful' };
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
            licenseId:            true,
            serviceFee:           true,
            feeType:              true,
            bulkIncentiveEnabled: true,
            bulkThreshold:        true,
          },
        },
        addresses: {
          select: {
            addressId: true,
            line1: true,
            line2: true,
            city: true,
            province: true,
            postalCode: true,
            latitude: true,
            longitude: true,
            isPrimary: true,
          },
        },
      },
    });
  
    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }
  
    const { customerDOB, collectorProfile, ...rest } = user;
  
    return {
      ...rest,
      ...(user.role === 'CUSTOMER' && { dateOfBirth: customerDOB?.dob ?? null }),
      ...(user.role === 'COLLECTOR' && { collectorProfile }),
    };
  }
 //helpers
  private generateAccessToken(userId: string, email: string, role: string) {
    return this.jwtService.sign(
      { sub: userId, email, role, type: 'access' },
      { expiresIn: '7d' },
    );
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}