import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from './decorator/current-user.decorator';
import type { User } from '@prisma/client';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { Auth } from 'src/common/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    /**
   * POST /api/auth/register
   * Register new user or collector
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * POST /api/auth/verify-email
   * Verify user's email using OTP
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * POST /api/auth/resend-otp
   * Resend OTP for email verification
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() resendOTP: ResendOtpDto) {
       return this.authService.resendOTP(resendOTP.email);
  }

  /**
   * POST /api/auth/forgot-password
   * Initiate forgot password process by sending reset email
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

   /**
   * POST /api/auth/reset-password
   * Reset password using token from reset email
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.email
      , resetPasswordDto.token, resetPasswordDto.newPassword);
  }


   /**
   * POST /api/auth/login
   * login user or collector and return JWT token
   */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }

   /**
   * GET /api/auth/me
   * Get current user (requires JWT)
   */
    @Get('me')
    @Auth()
    async getCurrentUser(@CurrentUser() user: User) {
      return this.authService.getCurrentUser(user.userId);
    }

     /**
   * Patch /api/auth/change-password
   * Change password for authenticated user (requires JWT)
   */
  @Patch('change-password')
  @Auth()
    async changePassword(
     @CurrentUser() user: User,
      @Body() changePasswordDto: ChangePasswordDto,
    ) {
      return this.authService.changePassword(
        user.userId,
        changePasswordDto.currentPassword,
        changePasswordDto.newPassword,
      );
    }

}
