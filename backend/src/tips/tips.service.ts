import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { ErrorMessage } from '../common/error-message';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  // Called by the Vercel cron job daily at midnight — no-op now, selection
  // happens deterministically in getRandomActiveTip().
  async refreshDailyTip(): Promise<void> {
    // no-op: kept for backwards compatibility with CronController
  }

  // Returns the same tip for the whole day using a deterministic day-based index.
  // Safe for serverless — no in-memory state required.
  async getRandomActiveTip() {
    const now = new Date();
    const activeTips = await this.prisma.tip.findMany({
      where: {
        active: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!activeTips.length) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    // Same tip all day: day-of-epoch mod tip count
    const dayIndex = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
    return activeTips[dayIndex % activeTips.length];
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