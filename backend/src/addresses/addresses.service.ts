import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  create(createAddressDto: CreateAddressDto) {
    // TODO: Implement
    return { message: 'Address created' };
  }

  findAll(userId: string) {
    // TODO: Implement
    return [];
  }

  findOne(id: string) {
    // TODO: Implement
    return { addressId: id };
  }

  update(id: string, updateAddressDto: UpdateAddressDto) {
    // TODO: Implement
    return { message: 'Updated' };
  }

  remove(id: string) {
    // TODO: Implement
    return { message: 'Deleted' };
  }

  setDefault(userId: string, addressId: string) {
    // TODO: Implement
    return { message: 'Set as default' };
  }
}

