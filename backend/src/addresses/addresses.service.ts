import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessage } from '../common/error-message';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAddressDto: AddressDto) {
    const { ...addressData } = createAddressDto;

    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    const existingAddress = await this.prisma.address.findFirst({
      where: {
        userId,
        line1: addressData.line1,
        postalCode: addressData.postalCode,
      },
    });

    if (existingAddress) {
      throw new BadRequestException(ErrorMessage.ADDRESS_ALREADY_EXISTS);
    }

    const addressCount = await this.prisma.address.count({
      where: { userId },
    });

    const isPrimary = addressCount === 0 || addressData.isPrimary === true;

    if (isPrimary) {
      await this.prisma.address.updateMany({
        where: { userId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        line1: addressData.line1,
        line2: addressData.line2,
        city: addressData.city,
        province: addressData.province,
        postalCode: addressData.postalCode,
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        isPrimary,
        userId,
      },
    });

    return {
      message: 'Address created successfully',
      address,
    };
  }

  async findAll(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return addresses;
  }

  async findOne(addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { addressId },
    });

    if (!address) {
      throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND);
    }

    return address;
  }

  async update(addressId: string, updateAddressDto: UpdateAddressDto) {
    const existingAddress = await this.prisma.address.findUnique({
      where: { addressId },
    });

    if (!existingAddress) {
      throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND);
    }

    if (updateAddressDto.isPrimary === true) {
      await this.prisma.address.updateMany({
        where: {
          userId: existingAddress.userId,
          isPrimary: true,
          addressId: { not: addressId },
        },
        data: { isPrimary: false },
      });
    }

    const updatedAddress = await this.prisma.address.update({
      where: { addressId },
      data: updateAddressDto,
    });

    return {
      message: 'Address updated successfully',
      address: updatedAddress,
    };
  }

  async remove(addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { addressId },
    });

    if (!address) {
      throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND);
    }

    if (address.isPrimary) {
      const otherAddresses = await this.prisma.address.count({
        where: {
          userId: address.userId,
          addressId: { not: addressId },
        },
      });

      if (otherAddresses > 0) {
        throw new BadRequestException(ErrorMessage.ADDRESS_PRIMARY_DELETE);
      }
    }

    await this.prisma.address.delete({
      where: { addressId },
    });

    return {
      message: 'Address deleted successfully',
    };
  }

  async setDefault(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: {
        addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException(ErrorMessage.ADDRESS_NOT_FOUND);
    }

    if (address.isPrimary) {
      throw new BadRequestException(ErrorMessage.ADDRESS_ALREADY_PRIMARY);
    }

    await this.prisma.address.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });

    const updatedAddress = await this.prisma.address.update({
      where: { addressId },
      data: { isPrimary: true },
    });

    return {
      message: 'Address set as primary successfully',
      address: updatedAddress,
    };
  }

  // Get primary address for a user
  async getDefaultAddress(userId: string) {
    // Guard: if a full user object is passed instead of a string, extract the userId
    const resolvedId = typeof userId === 'string' ? userId : (userId as any)?.userId;

    if (!resolvedId) {
      throw new NotFoundException(ErrorMessage.USER_NOT_FOUND);
    }

    const primaryAddress = await this.prisma.address.findFirst({
      where: {
        userId: resolvedId,
        isPrimary: true,
      },
    });

    if (!primaryAddress) {
      throw new NotFoundException(ErrorMessage.NO_PRIMARY_ADDRESS);
    }

    return primaryAddress;
  }

  async validateOwnership(addressId: string, userId: string): Promise<boolean> {
    const address = await this.prisma.address.findFirst({
      where: {
        addressId,
        userId,
      },
    });

    if (!address) {
      throw new UnauthorizedException(ErrorMessage.ADDRESS_NO_ACCESS);
    }
    return !!address;
  }
}