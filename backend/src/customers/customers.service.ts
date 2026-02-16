import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  getDashboardStats(userId: string) {
    return `This action returns dashboard data for customer with ID: ${userId}`;
  }

}
