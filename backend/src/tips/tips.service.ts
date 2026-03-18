import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { ErrorMessage } from '../common/error-message';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  // In-memory store for the current day's tip
  private dailyTip: {
    tip: any;
    date: string;
  } | null = null;

  // Runs every day at midnight to pick a new tip
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async refreshDailyTip() {
    const now = new Date();
    const activeTips = await this.prisma.tip.findMany({
      where: {
        active: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
    });

    if (activeTips.length > 0) {
      const randomTip = activeTips[Math.floor(Math.random() * activeTips.length)];
      this.dailyTip = {
        tip: randomTip,
        date: now.toISOString().split('T')[0], // e.g. "2026-03-17"
      };
    }
  }

  // Public: returns the tip of the day (same tip for the whole day)
  async getRandomActiveTip() {
    const today = new Date().toISOString().split('T')[0];

    // If no daily tip yet or it's from a previous day, refresh it
    if (!this.dailyTip || this.dailyTip.date !== today) {
      await this.refreshDailyTip();
    }

    if (!this.dailyTip) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    return this.dailyTip.tip;
  }

  // Create a tip
  async createTip(createTipDto: CreateTipDto) {
    const existingTip = await this.prisma.tip.findFirst({
      where: { content: createTipDto.content },
    });

    if (existingTip) {
      throw new BadRequestException(ErrorMessage.TIP_ALREADY_EXISTS);
    }

    const tip = await this.prisma.tip.create({
      data: createTipDto,
    });

    return {
      message: 'Tip created successfully',
      tip,
    };
  }

  // Get all tips with optional active filter
  async getAllTips(activeOnly?: boolean) {
    const tips = await this.prisma.tip.findMany({
      where: activeOnly !== undefined ? { active: activeOnly } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return tips;
  }

  // Get a single tip by ID
  async getTipById(tipId: string) {
    const tip = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!tip) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    return tip;
  }

  // Update a tip
  async updateTip(tipId: string, updateTipDto: UpdateTipDto) {
    const existing = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!existing) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    if (updateTipDto.content && updateTipDto.content !== existing.content) {
      const duplicateTip = await this.prisma.tip.findFirst({
        where: { content: updateTipDto.content },
      });

      if (duplicateTip) {
        throw new BadRequestException(ErrorMessage.TIP_ALREADY_EXISTS);
      }
    }

    const updated = await this.prisma.tip.update({
      where: { tipId },
      data: updateTipDto,
    });

    return {
      message: 'Tip updated successfully',
      tip: updated,
    };
  }

  // Delete a tip
  async deleteTip(tipId: string) {
    const existing = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!existing) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    await this.prisma.tip.delete({
      where: { tipId },
    });

    return {
      message: 'Tip deleted successfully',
    };
  }

  // Toggle active/inactive
  async toggleTipActiveStatus(tipId: string) {
    const existing = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!existing) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    const updated = await this.prisma.tip.update({
      where: { tipId },
      data: { active: !existing.active },
    });

    return {
      message: `Tip ${updated.active ? 'activated' : 'deactivated'} successfully`,
      tip: updated,
    };
  }
}