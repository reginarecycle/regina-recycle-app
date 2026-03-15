import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressDto } from './dto/address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { type User } from '@prisma/client/wasm';
import { Auth } from '../common/decorator/auth.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @Auth()
  create (@CurrentUser() user: User, @Body() addressDto: AddressDto) {
    return this.addressesService.create(user.userId, addressDto);
  }

  @Get()
  @Auth()
  async findAll(@CurrentUser('id') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get('default')
  @Auth()
  async getDefault(@CurrentUser('id') userId: string) {
    return this.addressesService.getDefaultAddress(userId);
  }

  @Get(':id')
  @Auth()
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const isOwner = await this.addressesService.validateOwnership(id, userId);
    if (!isOwner) {
      throw new UnauthorizedException('You do not have access to this address');
    }
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser('id') userId: string,
  ) {
    const isOwner = await this.addressesService.validateOwnership(id, userId);
    if (!isOwner) {
      throw new UnauthorizedException('You do not have access to this address');
    }
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @Auth()
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const isOwner = await this.addressesService.validateOwnership(id, userId);
    if (!isOwner) {
      throw new UnauthorizedException('You do not have access to this address');
    }
    return this.addressesService.remove(id);
  }

  @Patch(':id/set-default')
  @Auth()
  async setDefault(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.setDefault(userId, id);
  }
}