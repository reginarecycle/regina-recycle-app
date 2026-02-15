import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    /**
   * POST /api/auth/register
   * Register new user or collector
   */
  @Post('register')
  async register(@Body() dto: any) {
    // TODO: Add RegisterDto
    return this.authService.register(dto);
  }

  /**
   * POST /api/auth/verify-email
   * Verify user's email using OTP
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: any) {
    // TODO: Add VerifyEmailDto
    return this.authService.verifyEmail(dto);
  }

  /**
   * POST /api/auth/resend-otp
   * Resend OTP for email verification
   */
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() dto: any) {
       // TODO: Add ResendOTPDto
       return this.authService.resendOTP(dto);
  }

  /**
   * POST /api/auth/forgot-password
   * Initiate forgot password process by sending reset email
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: any) {
    // TODO: Add ForgotPasswordDto
    return this.authService.forgotPassword(dto);
  }

   /**
   * POST /api/auth/reset-password
   * Reset password using token from reset email
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: any) {
    // TODO: Add ResetPasswordDto
    return this.authService.resetPassword(dto);
  }

   /**
   * POST /api/auth/login
   * login user or collector and return JWT token
   */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: any) {
      // TODO: Add LoginDto
      return this.authService.login(dto);
    }

   /**
   * GET /api/auth/me
   * Get current user (requires JWT)
   */
    @Get('me')
    @UseGuards()//TODO: Add JWTAuthGuard
    async getCurrentUser(@Request() req) {
      return this.authService.getCurrentUser(req.user.id);
    }
}
