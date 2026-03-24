import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailTemplatesService } from './email.template.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private config: ConfigService,
    private templates: EmailTemplatesService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST') || 'smtp.gmail.com',
      port: this.config.get('SMTP_PORT') || 587,
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"Regina Recycle" <${this.config.get('SMTP_FROM')}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Error sending email to ${to}:`, error);
      throw error;
    }
  }

  async sendVerificationEmail(email: string, otp: string, name: string, role: string) {
    await this.send(
      email,
      'Verify Your Email - Regina Recycle',
      this.templates.verification(name, otp, role),
    );
  }

  async sendPasswordResetEmail(email: string, token: string, name: string, role: string) {
    await this.send(
      email,
      'Reset Your Password - Regina Recycle',
      this.templates.passwordReset(name, token, role),
    );
  }

  async sendWelcomeEmail(email: string, name: string, role: string) {
    try {
      await this.send(
        email,
        'Welcome to Regina Recycle!',
        this.templates.welcome(name, role),
      );
    } catch {
      // Welcome email is not critical, don't throw
    }
  }

  async sendNotificationEmail(params: {
    to: string;
    subject: string;
    message: string;
    type: string;
  }) {
    await this.send(
      params.to,
      params.subject,
      this.templates.notification(params.subject, params.message, params.type),
    );
  }
}