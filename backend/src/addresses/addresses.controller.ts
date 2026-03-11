import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  // No auth guard - open for registration (or protect it if needed)
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser('id') userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get('default')
  @UseGuards(JwtAuthGuard)
  async getDefault(@CurrentUser('id') userId: string) {
    return this.addressesService.getDefaultAddress(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async setDefault(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.addressesService.setDefault(userId, id);
  }
}