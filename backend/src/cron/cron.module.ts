import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { TipsModule } from '../tips/tips.module';

@Module({
  imports: [NotificationsModule, TipsModule],
  controllers: [CronController],
})
export class CronModule {}
