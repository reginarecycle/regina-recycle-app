import { Injectable, Logger } from '@nestjs/common';
import { PusherService } from '../pusher.service';
import { IObserver, NotificationEvent } from '../interface/observer.interface';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const typeMap: Record<string, NotificationType> = {
  PICKUP_SCHEDULED:        NotificationType.IN_APP_PICKUP_REMINDER,
  PICKUP_STATUS_CHANGED:   NotificationType.ALERT,
  PICKUP_COMPLETED:        NotificationType.IN_APP_PICKUP_REMINDER,
  WALLET_UPDATED_CREDIT:   NotificationType.PAYMENT_ACTIVITY,
  WALLET_UPDATED_DEBIT:    NotificationType.PAYMENT_ACTIVITY,
  MATERIAL_PRICING_UPDATED: NotificationType.ACCOUNT_ACTIVITY,
  LOGIN:                   NotificationType.ACCOUNT_ACTIVITY,
  SECURITY:                NotificationType.ACCOUNT_ACTIVITY,
  PROFILE_UPDATED:         NotificationType.ACCOUNT_ACTIVITY,
  PASSWORD_CHANGED:        NotificationType.ACCOUNT_ACTIVITY,
  ALERT:                   NotificationType.ALERT,
};
@Injectable()
export class InAppNotificationObserver implements IObserver {
  private readonly logger = new Logger(InAppNotificationObserver.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pusher: PusherService,
  ) { }

  async update(event: NotificationEvent): Promise<void> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: event.title,
          message: event.message,
          type: typeMap[event.type] ?? NotificationType.ALERT,
          userId: event.userId,
          isRead: false,
        },
      });

      await this.pusher.sendToUser(event.userId, notification);
      this.logger.log(`In-app notification created for user ${event.userId}`);
    } catch (error) {
      this.logger.error(`Failed to create in-app notification`, error);
      throw error;
    }
  }
}
