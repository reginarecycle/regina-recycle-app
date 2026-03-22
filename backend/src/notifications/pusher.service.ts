import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Pusher from 'pusher';

@Injectable()
export class PusherService {
  private readonly pusher: Pusher;
  private readonly logger = new Logger(PusherService.name);

  constructor(private readonly config: ConfigService) {
    this.pusher = new Pusher({
      appId: config.getOrThrow('PUSHER_APP_ID'),
      key: config.getOrThrow('PUSHER_KEY'),
      secret: config.getOrThrow('PUSHER_SECRET'),
      cluster: config.getOrThrow('PUSHER_CLUSTER'),
      useTLS: true,
    });
  }

  async sendToUser(userId: string, notification: any): Promise<void> {
    try {
      await this.pusher.trigger(`user-${userId}`, 'notification', notification);
      this.logger.log(`Notification sent to user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to send notification to user ${userId}`, error);
    }
  }
}
