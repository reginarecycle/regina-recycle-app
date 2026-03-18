export interface IObserver {
  update(event: NotificationEvent): Promise<void>;
}

export interface ISubject {
  register(observer: IObserver): void;
  unregister(observer: IObserver): void;
  notify(event: NotificationEvent): Promise<void>;
}

export interface NotificationEvent {
  type: NotificationEventType;
  title: string;
  message: string;
  userId: string;
  recipientEmail?: string;
  metadata?: Record<string, any>;
}

export enum NotificationEventType {
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  PICKUP_STATUS_CHANGED = 'PICKUP_STATUS_CHANGED',
  PICKUP_COMPLETED = 'PICKUP_COMPLETED',
  WALLET_UPDATED_CREDIT = 'WALLET_UPDATED_CREDIT',
  WALLET_UPDATED_DEBIT = 'WALLET_UPDATED_DEBIT',
  MATERIAL_PRICING_UPDATED = 'MATERIAL_PRICING_UPDATED',
  ALERT = 'ALERT',
}
