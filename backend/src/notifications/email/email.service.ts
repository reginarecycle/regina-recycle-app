import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.config.get('SMTP_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, otp: string, name: string, role: string) {
    const mailOptions = {
      from: `"Regina Recycle" <${this.config.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Verify Your Email - Regina Recycle',
      html: this.getVerificationEmailTemplate(name, otp, role),
    };
  
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
  

  async sendPasswordResetEmail(email: string, token: string, name: string, role: string) {

    const mailOptions = {
      from: `"Regina Recycle" <${this.config.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Reset Your Password - Regina Recycle',
      html: this.getPasswordResetEmailTemplate(name, token, role),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, name: string, role: string) {
    const mailOptions = {
      from: `"Regina Recycle" <${this.config.get('SMTP_FROM')}>`,
      to: email,
      subject: 'Welcome to Regina Recycle!',
      html: this.getWelcomeEmailTemplate(name, role),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw - welcome email is not critical
    }
  }

  // Email Templates

  private getVerificationEmailTemplate(name: string, otp: string, role:string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f4f0; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f0; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 36px 40px 28px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: middle;">
                         <img src="https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773275157/ReginaRecycleLogo_rjf0tq.svg" alt="ReginaRecycle" width="52" height="52" style="display: block;">
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 20px; font-weight: 700; color: #1a1a1a;">ReginaRecycle</div>
                          <div style="font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase;">${role} Portal</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <hr style="border: none; border-top: 1px solid #eee; margin: 0;">
                  </td>
                </tr>
  
                <!-- Content -->
                <tr>
                  <td align="center" style="padding: 48px 40px 36px;">
                    <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #1a1a1a;">Verify your email address</h1>
                    <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.6; max-width: 420px;">
                      Welcome to ReginaRecycle, <strong>${name}</strong>! We're excited to have you on board. 
                      Use the code below to verify your email address and complete your account setup.
                    </p>
  
                    <!-- OTP Box -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 32px;">
                      <tr>
                        <td style="background-color: #f6f9f6; border: 2px solid #344E41; border-radius: 12px; padding: 24px 48px; text-align: center;">
                          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #344E41; font-weight: 600; margin-bottom: 8px;">Verification Code</div>
                          <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #344E41;">${otp}</div>
                          <div style="font-size: 12px; color: #999; margin-top: 8px;">Expires in 3 minutes</div>
                        </td>
                      </tr>
                    </table>
  
                    <!-- Copy Link Section -->
                    <p style="margin: 0 0 8px; font-size: 13px; color: #999;">
                      If you didn't create an account, please ignore this email.
                    </p>
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f9f6; padding: 24px 40px; border-top: 1px solid #eee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Contact Us</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 4px; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} ReginaRecycle. All rights reserved.</p>
                          <p style="margin: 0; font-size: 12px; color: #aaa;">123 Lane, Str. Regina, SK S4P 3V7, Canada</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(name: string, token: string, role:string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f4f0; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f0; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 36px 40px 28px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                       <td style="vertical-align: middle;">
                         <img src="https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773275157/ReginaRecycleLogo_rjf0tq.svg" alt="ReginaRecycle" width="52" height="52" style="display: block;">
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 20px; font-weight: 700; color: #1a1a1a;">ReginaRecycle</div>
                          <div style="font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase;">${role} Portal</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <hr style="border: none; border-top: 1px solid #eee; margin: 0;">
                  </td>
                </tr>
  
                <!-- Content -->
                <tr>
                  <td align="center" style="padding: 48px 40px 36px;">
                    <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #1a1a1a;">Reset your password</h1>
                    <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.6; max-width: 420px;">
                      Hello <strong>${name}</strong>, we received a request to reset your password. 
                      Click the button below to create a new password.
                    </p>
  
                 

                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 32px;">
                      <tr>
                        <td style="background-color: #f6f9f6; border: 2px solid #344E41; border-radius: 12px; padding: 24px 48px; text-align: center;">
                          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #344E41; font-weight: 600; margin-bottom: 8px;">Verification Code</div>
                          <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #344E41;">${token}</div>
                        </td>
                      </tr>
                    </table>
  
                    <!-- Warning -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto; max-width: 460px;">
                      <tr>
                        <td style="background-color: #fff8ec; border-left: 4px solid #f5a623; border-radius: 4px; padding: 12px 16px;">
                          <p style="margin: 0; font-size: 13px; color: #856404;">
                            <strong>Security Notice:</strong> This pin expires in 5 minutes. If you didn't request a password reset, please ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f9f6; padding: 24px 40px; border-top: 1px solid #eee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Contact Us</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 4px; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} ReginaRecycle. All rights reserved.</p>
                          <p style="margin: 0; font-size: 12px; color: #aaa;">123 Lane, Str. Regina, SK S4P 3V7, Canada</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(name: string, role: string): string {
    const isCustomer = role === 'CUSTOMER';
    const features = isCustomer ? [
      'Schedule convenient pickups',
      'Earn money from recyclables',
      'Track your environmental impact',
      'Manage your wallet',
    ] : [
      'Accept pickup requests',
      'Manage your pricing',
      'Track your business stats',
      'Build your customer base',
    ];
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f0f4f0; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f0; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
  
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 36px 40px 28px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align: middle;">
                         <img src="https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773275157/ReginaRecycleLogo_rjf0tq.svg" alt="ReginaRecycle" width="52" height="52" style="display: block;">
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 20px; font-weight: 700; color: #1a1a1a;">ReginaRecycle</div>
                          <div style="font-size: 11px; letter-spacing: 2px; color: #888; text-transform: uppercase;">${isCustomer ? 'Customer Portal' : 'Collector Portal'}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Divider -->
                <tr>
                  <td style="padding: 0 40px;">
                    <hr style="border: none; border-top: 1px solid #eee; margin: 0;">
                  </td>
                </tr>
  
                <!-- Content -->
                <tr>
                  <td align="center" style="padding: 48px 40px 36px;">
                    <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: #1a1a1a;">Welcome,${name}! 🥳</h1>
                    <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.6; max-width: 420px;">
                      Welcome to ReginaRecycle, where recycling meets reward! Here's what you can do as a <strong>${isCustomer ? 'Customer' : 'Collector'}</strong>:
                    </p>
  
                    <!-- Features -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 32px; max-width: 460px; width: 100%;">
                      <tr>
                        <td style="background-color: #f6f9f6; border-radius: 12px; padding: 24px 28px;">
                          ${features.map(f => `
                            <table cellpadding="0" cellspacing="0" style="margin-bottom: 12px; width: 100%;">
                              <tr>
                                <td width="24" style="vertical-align: top; padding-top: 2px;">
                                  <span style="color: #344E41; font-size: 16px;">✓</span>
                                </td>
                                <td style="font-size: 14px; color: #444;">${f}</td>
                              </tr>
                            </table>
                          `).join('')}
                        </td>
                      </tr>
                    </table>
  
                    <!-- Button -->
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background-color: #344E41; border-radius: 8px; padding: 14px 36px;">
                          <a href="${this.config.get('FRONTEND_URL')}/login" style="color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600;">Get Started</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f9f6; padding: 24px 40px; border-top: 1px solid #eee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Help Center</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Contact Us</a>
                          <a href="#" style="color: #666; text-decoration: none; font-size: 13px; margin: 0 12px;">Privacy Policy</a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <p style="margin: 0 0 4px; font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} ReginaRecycle. All rights reserved.</p>
                          <p style="margin: 0; font-size: 12px; color: #aaa;">123 Lane, Str. Regina, SK S4P 3V7, Canada</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }
}
