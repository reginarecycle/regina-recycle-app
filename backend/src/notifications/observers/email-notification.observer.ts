import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { IObserver, NotificationEvent } from '../interface/observer.interface';

@Injectable()
export class EmailNotificationObserver implements IObserver {
  private readonly logger = new Logger(EmailNotificationObserver.name);

  constructor(private readonly emailService: EmailService) {}

  async update(event: NotificationEvent): Promise<void> {
    if (!event.recipientEmail) return;

    try {
      await this.emailService.sendNotificationEmail({
        to: event.recipientEmail,
        subject: event.title,
        message: event.message,
        type: event.type,
      });
      this.logger.log(`Email sent to ${event.recipientEmail} for event ${event.type}`);
    } catch (error) {
      this.logger.error(`Failed to send email for event ${event.type}`, error);
      // Do not re-throw — email failure should not break the main operation
    }
  }
}
