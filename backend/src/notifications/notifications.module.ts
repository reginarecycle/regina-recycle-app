import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email/email.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsController } from './notifications.controller';
import { EmailNotificationObserver } from './observers/email-notification.observer';
import { NotificationGatewayService } from './notifications.gateway.service';
import { InAppNotificationObserver } from './observers/inapp-notification.observer';
import { EmailTemplatesService } from './email/email.template.service';
import { NotificationsCronService } from './notifications.cron.service';
import { PusherService } from './pusher.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    PusherService,
    NotificationsService,
    NotificationGatewayService,
    EmailNotificationObserver,
    InAppNotificationObserver,
    EmailService,
    EmailTemplatesService,
    NotificationsCronService,
  ],
  exports: [NotificationGatewayService, NotificationsCronService, PusherService],
})
export class NotificationsModule {}
