import { Controller, Get, Patch, Param, Query, Body, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { Auth } from '../common/decorator/auth.decorator';
import { NotificationQueryDto } from './dto/notification-query.dto';
import type { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }


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

  @Auth()
  @Patch(':notificationId/unread')
  markAsUnread(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.markAsUnread(notificationId, user.userId);
  }

  @Auth()
  @Delete(':notificationId')
  deleteNotification(
    @Param('notificationId') notificationId: string,
    @CurrentUser() user: User,
  ) {
    return this.notificationsService.deleteNotification(notificationId, user.userId);
  }

}
