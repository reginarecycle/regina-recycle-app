import { Controller, Post, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsCronService } from '../notifications/notifications.cron.service';
import { TipsService } from '../tips/tips.service';

@Controller('cron')
export class CronController {
  constructor(
    private readonly config: ConfigService,
    private readonly notificationsCron: NotificationsCronService,
    private readonly tipsService: TipsService,
  ) {}

  private verifySecret(authHeader: string | undefined): void {
    const secret = this.config.get('CRON_SECRET');
    if (!secret || authHeader !== `Bearer ${secret}`) {
      throw new UnauthorizedException('Invalid cron secret');
    }
  }

  @Post('pickup-reminders')
  @HttpCode(200)
  async pickupReminders(@Headers('authorization') auth: string) {
    this.verifySecret(auth);
    await this.notificationsCron.sendPickupReminders();
    return { ok: true };
  }

  @Post('cancel-expired-pickups')
  @HttpCode(200)
  async cancelExpiredPickups(@Headers('authorization') auth: string) {
    this.verifySecret(auth);
    await this.notificationsCron.cancelExpiredPickups();
    return { ok: true };
  }

  @Post('refresh-tip')
  @HttpCode(200)
  async refreshTip(@Headers('authorization') auth: string) {
    this.verifySecret(auth);
    await this.tipsService.refreshDailyTip();
    return { ok: true };
  }
}
