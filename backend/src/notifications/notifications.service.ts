import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { getPaginationParams, paginate } from '../common/pagination/pagination-helper';
import { NotificationQueryDto } from './dto/notification-query.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserNotifications(userId: string, query: NotificationQueryDto) {
    const { page = 1, limit = 20, isRead } = query;
    const { skip, take } = getPaginationParams(page, limit);
  
    const where: any = { userId };
    if (isRead !== undefined) where.isRead = isRead;
  
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.notification.count({ where }),
    ]);
  
    return paginate(notifications, total, page, limit);
  }
   

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: { notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getPreferences(userId: string) {
    const pref = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!pref) {
      return this.prisma.notificationPreference.create({
        data: { userId },
      });
    }
    return pref;
  }

  async updatePreferences(
    userId: string,
    dto: UpdateNotificationPreferenceDto,
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });
  }
}
