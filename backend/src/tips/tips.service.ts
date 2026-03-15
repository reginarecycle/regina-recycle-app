import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { ErrorMessage } from '../common/error-message';

@Injectable()
export class TipsService {
  constructor(private prisma: PrismaService) {}

  // Public: returns one random active tip within its date range
  async getTips() {
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

    if (activeTips.length === 0) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    const randomTip = activeTips[Math.floor(Math.random() * activeTips.length)];
    return randomTip;
  }

  // Create a tip
  async create(createTipDto: CreateTipDto) {
    // Check for duplicate tip content
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
  async findAll(activeOnly?: boolean) {
    const tips = await this.prisma.tip.findMany({
      where: activeOnly !== undefined ? { active: activeOnly } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return tips;
  }

  // Get a single tip by ID
  async findOne(tipId: string) {
    const tip = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!tip) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    return tip;
  }

  // Update a tip
  async update(tipId: string, updateTipDto: UpdateTipDto) {
    const existing = await this.prisma.tip.findUnique({
      where: { tipId },
    });

    if (!existing) {
      throw new NotFoundException(ErrorMessage.TIP_NOT_FOUND);
    }

    // Check for duplicate content if content is being updated
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
  async remove(tipId: string) {
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
  async toggleActive(tipId: string) {
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