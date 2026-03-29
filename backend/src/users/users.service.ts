import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationGatewayService } from '../notifications/notifications.gateway.service';
import { NotificationEventType } from '../notifications/interface/observer.interface';
import { UpdateUserDto } from './dto/update-user.dto';

export interface DeleteBlockers {
  canDelete: false;
  pendingPickups: number;
  walletBalance: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationGatewayService,
  ) { }

  // ─── Update Profile ───────────────────────────────────────────────────────────

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updated = await this.prisma.user.update({
      where: { userId },
      data: {
        ...(dto.name        !== undefined && { name:        dto.name        }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      },
      select: {
        userId: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        updatedAt: true,
      },
    });

    if (dto.dateOfBirth !== undefined) {
      await this.prisma.customerDOB.upsert({
        where:  { userId },
        update: { dob: new Date(dto.dateOfBirth) },
        create: { userId, dob: new Date(dto.dateOfBirth) },
      });
    }

    if (dto.licenseId !== undefined) {
      await this.prisma.collectorProfile.update({
        where: { userId },
        data:  { licenseId: dto.licenseId },
      });
    }

    this.notificationService
      .notifyProfileUpdated({ userId, recipientEmail: updated.email })
      .catch((error) =>
        this.logger.error(
          `Failed to send profile update notification for user ${userId}`,
          error.message,
        ),
      );

    this.logger.log(`Profile updated for user ${userId}`);
    return updated;
  }


  // ─── Deactivate Account ───────────────────────────────────────────────────────

  async deactivateAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (user.status === 'INACTIVE') {
      throw new BadRequestException('Account is already deactivated');
    }

    await this.prisma.user.update({
      where: { userId },
      data: { status: 'INACTIVE' },
    });

    await this.notificationService.sendNotification({
      type: NotificationEventType.ALERT,
      title: 'Account Deactivated',
      message: 'Your account has been deactivated. Contact support if this was a mistake.',
      userId,
      recipientEmail: user.email,
      metadata: { deactivatedAt: new Date().toISOString() },
    }).catch((error) =>
      this.logger.error(
        `Failed to send deactivation notification for user ${userId}`,
        error.message,
      ),
    );

    this.logger.log(`Account deactivated for user ${userId}`);
    return { message: 'Account deactivated successfully' };
  }

  // ─── Check Delete Eligibility ─────────────────────────────────────────────────

  async checkDeleteEligibility(userId: string): Promise<{ canDelete: true } | DeleteBlockers> {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const [pendingPickups, wallet] = await Promise.all([
      this.prisma.pickup.count({
        where: {
          requesterUserId: userId,
          status: { in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.wallet.findUnique({
        where: { userId },
        select: { balance: true },
      }),
    ]);

    const walletBalance = Number(wallet?.balance ?? 0);
    const hasBlockers = pendingPickups > 0 || walletBalance > 0;

    if (hasBlockers) {
      return { canDelete: false, pendingPickups, walletBalance };
    }

    return { canDelete: true };
  }

  // ─── Delete Account ───────────────────────────────────────────────────────────

  async deleteAccount(userId: string) {
    const eligibility = await this.checkDeleteEligibility(userId);
    if (!eligibility.canDelete) {
      const { pendingPickups, walletBalance } = eligibility as DeleteBlockers;
      const reasons: string[] = [];
      if (pendingPickups > 0) reasons.push(`${pendingPickups} pending pickup(s)`);
      if (walletBalance > 0) reasons.push(`wallet balance of $${walletBalance.toFixed(2)} CAD`);
      throw new BadRequestException(
        `Account cannot be deleted. Please resolve the following first: ${reasons.join(', ')}.`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { userId }, select: { email: true } });

    await this.notificationService.sendNotification({
      type: NotificationEventType.ALERT,
      title: 'Account Deleted',
      message: 'Your account and all associated data have been permanently deleted.',
      userId,
      recipientEmail: user!.email,
      metadata: { deletedAt: new Date().toISOString() },
    }).catch((error) =>
      this.logger.error(
        `Failed to send deletion notification for user ${userId}`,
        error.message,
      ),
    );

    await this.prisma.user.update({
      where: { userId },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    this.logger.log(`Account soft-deleted for user ${userId}`);
    return { message: 'Account deleted successfully' };
  }
}
