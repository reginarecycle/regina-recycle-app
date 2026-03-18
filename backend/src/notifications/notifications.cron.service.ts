import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationGatewayService } from './notifications.gateway.service';
import { NotificationEventType } from './interface/observer.interface';
// import { NotificationGatewayService } from './notification-gateway.service';
// import { NotificationEventType } from './interfaces/observer.interface';

const BATCH_SIZE = 500;

@Injectable()
export class NotificationsCronService {
    private readonly logger = new Logger(NotificationsCronService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationService: NotificationGatewayService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_8AM)
    async sendPickupReminders() {
        this.logger.log('Running pickup reminder cron job...');

        const now = new Date();
        const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

        let skip = 0;
        let totalProcessed = 0;
        const collectorMap = new Map<string, any[]>();

        while (true) {
            const pickups = await this.prisma.pickup.findMany({
                where: {
                    scheduledAt: { gte: todayStart, lt: todayEnd },
                    status: { in: ['PENDING', 'ACCEPTED'] },
                },
                include: {
                    requester: {
                        select: { userId: true, email: true, name: true },
                    },
                    collector: {
                        select: { userId: true, email: true, name: true },
                    },
                },
                skip,
                take: BATCH_SIZE,
                orderBy: { scheduledAt: 'asc' },
            });

            if (pickups.length === 0) break;

            this.logger.log(
                `Processing batch of ${pickups.length} pickups (skip: ${skip})`,
            );

            for (const pickup of pickups) {
                // Customer — individual reminder per pickup
                if (pickup.requester) {
                    await this.processCustomerReminder(pickup).catch((error) =>
                        this.logger.error(
                            `Failed to notify customer ${pickup.requester?.userId} for pickup ${pickup.pickupId}`,
                            error.message,
                        ),
                    );
                }

                // Collector — group pickups for summary
                if (pickup.collector) {
                    const existing = collectorMap.get(pickup.collector.userId) ?? [];
                    collectorMap.set(pickup.collector.userId, [...existing, pickup]);
                }
            }

            totalProcessed += pickups.length;
            skip += BATCH_SIZE;
            if (pickups.length < BATCH_SIZE) break;
        }

        // Send one summary notification per collector
        for (const [, pickups] of collectorMap) {
            await this.notifyCollector(pickups).catch((error) =>
                this.logger.error(
                    `Failed to notify collector ${pickups[0].collector.userId}`,
                    error.message,
                ),
            );
        }

        this.logger.log(
            `Pickup reminder cron completed. Total processed: ${totalProcessed}`,
        );
    }

    private async processCustomerReminder(pickup: any) {
        const scheduledTime = new Date(pickup.scheduledAt).toLocaleTimeString(
            'en-CA',
            {
                hour: '2-digit',
                minute: '2-digit',
            },
        );

        await this.notificationService.sendNotification({
            type: NotificationEventType.PICKUP_SCHEDULED,
            title: 'Pickup Reminder',
            message: `Your pickup is scheduled for today at ${scheduledTime}. Please ensure your recyclables are ready.`,
            userId: pickup.requester.userId,
            recipientEmail: pickup.requester.email,
            metadata: {
                pickupId: pickup.pickupId,
                scheduledAt: pickup.scheduledAt,
            },
        });
    }

    private async notifyCollector(pickups: any[]) {
        const collector = pickups[0].collector;
        const count = pickups.length;

        await this.notificationService.sendNotification({
            type: NotificationEventType.PICKUP_SCHEDULED,
            title: "Today's Collections",
            message:
                count === 1
                    ? `You have 1 collection scheduled for today.`
                    : `You have ${count} collections scheduled for today. Please plan your route accordingly.`,
            userId: collector.userId,
            recipientEmail: collector.email,
            metadata: {
                pickupIds: pickups.map((p) => p.pickupId),
                count,
            },
        });
    }

    // Manual trigger for testing purposes
    // async triggerManually() {
    //     await this.sendPickupReminders();
    // }
}