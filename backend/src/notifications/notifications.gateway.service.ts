import { Injectable } from '@nestjs/common';
import { EmailNotificationObserver } from './observers/email-notification.observer';
import { InAppNotificationObserver } from './observers/inapp-notification.observer';
import { IObserver, ISubject, NotificationEvent, NotificationEventType } from './interface/observer.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationGatewayService implements ISubject {
  private observers: IObserver[] = [];

  constructor(
    private readonly emailObserver: EmailNotificationObserver,
    private readonly inAppObserver: InAppNotificationObserver,
    private readonly prisma: PrismaService,
  ) {
    this.register(emailObserver);
    this.register(inAppObserver);
  }

  register(observer: IObserver): void {
    this.observers.push(observer);
  }

  unregister(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  async notify(event: NotificationEvent): Promise<void> {
    await Promise.all(this.observers.map((o) => o.update(event)));
  }

  async sendNotification(event: NotificationEvent): Promise<void> {
    // Check user preferences
    const preference = await this.prisma.notificationPreference.findUnique({
      where: { userId: event.userId },
    });

    const prefs = preference ?? {
      emailEnabled: true,
      inAppEnabled: true,
      pickupScheduled: true,
      pickupStatusChanged: true,
      pickupCompleted: true,
      walletUpdated: true,
    };

    const eventPrefMap: Record<NotificationEventType, boolean> = {
      [NotificationEventType.PICKUP_SCHEDULED]: preference?.emailPickupReminder ?? true,
      [NotificationEventType.PICKUP_STATUS_CHANGED]: preference?.inAppAlerts ?? true,
      [NotificationEventType.PICKUP_COMPLETED]: preference?.inAppAlerts ?? true,
      [NotificationEventType.WALLET_UPDATED_CREDIT]: preference?.emailAccountActivity ?? true,
      [NotificationEventType.WALLET_UPDATED_DEBIT]: preference?.emailAccountActivity ?? true,
      [NotificationEventType.MATERIAL_PRICING_UPDATED]: preference?.inAppAlerts ?? true,
      [NotificationEventType.ALERT]: preference?.inAppAlerts ?? true,
      [NotificationEventType.PASSWORD_CHANGED]: preference?.emailAccountActivity ?? true,
      [NotificationEventType.PROFILE_UPDATED]: preference?.emailAccountActivity ?? true,
    };

    if (!eventPrefMap[event.type]) return;

    const activeObservers = this.observers.filter((o) => {
      if (o instanceof EmailNotificationObserver) return preference?.emailAccountActivity ?? true;
      if (o instanceof InAppNotificationObserver) return preference?.inAppAlerts ?? true;
      return true;
    });

    await Promise.all(activeObservers.map((o) => o.update(event)));
  }

  async notifyPickupScheduled(params: {
    userId: string;
    recipientEmail: string;
    pickupId: string;
    scheduledDate: string;
  }) {
    const d = new Date(params.scheduledDate);
    const formattedDate = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })}, ${d.getFullYear()}`;

    await this.sendNotification({
      type: NotificationEventType.PICKUP_SCHEDULED,
      title: 'Pickup Scheduled',
      message: `Your pickup has been scheduled for ${formattedDate}.`,
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      metadata: { pickupId: params.pickupId },
    });
  }

  async notifyPickupStatusChanged(params: {
    userId: string;
    recipientEmail: string;
    pickupId: string;
    status: string;
  }) {
    await this.sendNotification({
      type: NotificationEventType.PICKUP_STATUS_CHANGED,
      title: 'Pickup Status Updated',
      message: `Your pickup status has been updated to ${params.status}.`,
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      metadata: { pickupId: params.pickupId, status: params.status },
    });
  }

  async notifyPickupCompleted(params: {
    userId: string;
    recipientEmail: string;
    pickupId: string;
    amount: number;
  }) {
    await this.sendNotification({
      type: NotificationEventType.PICKUP_COMPLETED,
      title: 'Pickup Completed',
      message: `Your pickup has been completed. $${params.amount} has been added to your wallet.`,
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      metadata: { pickupId: params.pickupId, amount: params.amount },
    });
  }

  async notifyWalletUpdated(params: {
    userId: string;
    recipientEmail: string;
    amount: number;
    balance: number;
    type: 'CREDIT' | 'DEBIT';
  }) {
    const isCredit = params.type === 'CREDIT';

    await this.sendNotification({
      type: isCredit
        ? NotificationEventType.WALLET_UPDATED_CREDIT
        : NotificationEventType.WALLET_UPDATED_DEBIT,
      title: isCredit ? 'Funds Added' : 'Withdrawal Processed',
      message: isCredit
        ? `$${params.amount} has been added to your wallet. New balance: $${params.balance}.`
        : `$${params.amount} has been withdrawn from your wallet. New balance: $${params.balance}.`,
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      metadata: { amount: params.amount, balance: params.balance },
    });
  }

  async notifyPasswordChanged(params: {
    userId: string;
    recipientEmail: string;
  }) {
    await this.sendNotification({
      type: NotificationEventType.PASSWORD_CHANGED,
      title: 'Password Changed',
      message:
        'If you did not make this change please contact us at info.reginarecycle@gmail.com',
      userId: params.userId,
      recipientEmail: params.recipientEmail,
    });
  }

  async notifyProfileUpdated(params: {
    userId: string;
    recipientEmail: string;
  }) {
    await this.sendNotification({
      type: NotificationEventType.PROFILE_UPDATED,
      title: 'Profile Updated',
      message:
        'Your profile has been updated, if you did not make this change please contact us at info.reginarecycle@gmail.com',
      userId: params.userId,
      recipientEmail: params.recipientEmail,
    });
  }

  async notifyAlert(params: {
    userId: string;
    recipientEmail: string;
    title: string;
    message: string;
  }) {
    await this.sendNotification({
      type: NotificationEventType.ALERT,
      title: params.title,
      message: params.message,
      userId: params.userId,
      recipientEmail: params.recipientEmail,
      metadata: { isAlert: true },
    });
  }
}
