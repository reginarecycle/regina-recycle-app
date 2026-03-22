import { Controller, Get, Patch, Param, Query, Body, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { Auth } from '../common/decorator/auth.decorator';
import { NotificationQueryDto } from './dto/notification-query.dto';
import type { User } from '@prisma/client';
import { NotificationGatewayService } from './notifications.gateway.service';
import { NotificationsCronService } from './notifications.cron.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator'
@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService,
    private readonly notificationGatewayService: NotificationGatewayService,  // remove after testing
    private readonly notificationsCronService: NotificationsCronService, // remove after testing  
  ) { }


  @Auth()
  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  getMyNotifications(
    @CurrentUser() user: User,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationsService.getUserNotifications(user.userId, query);

  }

  @Auth()
  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationsService.getUnreadCount(user.userId);
  }

  @Auth()
  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences' })
  getPreferences(@CurrentUser() user: User) {
    return this.notificationsService.getPreferences(user.userId);
  }

  @Auth()
  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePreferences(
    @CurrentUser() user: User,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return this.notificationsService.updatePreferences(user.userId, dto);
  }

  @Auth()
  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.userId);
  }

  @Auth()
  @Patch(':notificationId/read')
  markAsRead(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsRead(notificationId, user.userId);
  }

  // ─── Test endpoint to verify observer pattern works ───────────────────────────────

  // @Auth()
  // @Post('test')
  // @ApiOperation({ summary: 'Test notification — remove before production' })
  // async testNotification(@CurrentUser() user: User) {
  //   console.log('Testing notification for user:', user);
  //   try {
  //     await this.notificationGatewayService.sendNotification({
  //       type: NotificationEventType.PICKUP_SCHEDULED,
  //       title: 'Test Notification',
  //       message: 'This is a test to verify the observer pattern works.',
  //       userId: user.userId,
  //       recipientEmail: user.email,
  //       metadata: { test: true },
  //     });
  //     return { message: 'Test notification sent' };
  //   } catch (error) {
  //     return { message: 'Failed to send test notification', error: error.message };
  //   }
  // }

  // ─── Manual trigger for pickup reminder cron (testing only) ───────────────────────────────
  // @Auth()
  // @Post('cron/trigger')
  // @ApiOperation({ summary: 'Manually trigger pickup reminder cron — testing only' })
  // async triggerCron() {
  //   await this.notificationsCronService.triggerManually();
  //   return { message: 'Cron job triggered' };
  // }

  // ─── Test endpoint for alert notifications (testing only) ───────────────────────────────
  // @Auth()
  // @Post('test-alert')
  // @ApiOperation({ summary: 'Test alert notification — remove before production' })
  // async testAlert(@CurrentUser() user: any) {
  //   try {
  //     await this.notificationGatewayService.notifyAlert({
  //       userId: user.userId,
  //       recipientEmail: user.email,
  //       title: 'Service Disruption',
  //       message: 'Due to weather conditions, some pickups in your area may be delayed today. We apologize for the inconvenience.',
  //     });
  //     return { message: 'Alert notification sent' };
  //   } catch (error) {
  //     return { message: 'Failed to send alert', error: error.message };
  //   }
  // }

}
