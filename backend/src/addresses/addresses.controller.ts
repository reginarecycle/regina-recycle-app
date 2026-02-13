import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  // No auth guard - open for registration
  create(@Body() createAddressDto: CreateAddressDto) {
    // userId passed in DTO from registration
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  @UseGuards()  // TODO: Uncomment when JWT ready
  async findAll(/* @CurrentUser() user: User */) {
    const userId = 'temp-user-id';  // TODO: Remove placeholder
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  @UseGuards()  // TODO: Protected
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)  // TODO: Protected
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)  // TODO: Protected
  remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }

  @Patch(':id/set-default')
  // @UseGuards(JwtAuthGuard)  // TODO: Protected
  setDefault(@Param('id') id: string) {
    const userId = 'temp-user-id'; // TODO: Get from token
    return this.addressesService.setDefault(userId, id);
  }
}
