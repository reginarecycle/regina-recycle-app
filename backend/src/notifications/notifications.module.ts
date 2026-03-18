import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email/email.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { EmailNotificationObserver } from './observers/email-notification.observer';
import { NotificationGatewayService } from './notifications.gateway.service';
import { InAppNotificationObserver } from './observers/inapp-notification.observer';
import { EmailTemplatesService } from './email/email.template.service';
import { NotificationsCronService } from './notifications.cron.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationGatewayService,
    EmailNotificationObserver,
    InAppNotificationObserver,
    EmailService,
    EmailTemplatesService,
    NotificationsCronService,
  ],
  exports: [NotificationGatewayService, NotificationsGateway, NotificationsCronService],
})
export class NotificationsModule {}
