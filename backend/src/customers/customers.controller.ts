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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('dashboard-stats')
  // @UseGuards(JwtAuthGuard, CustomerGuard)
  getDashboardStats(/* @CurrentUser() user: User */) {
    const userId = 'temp-user-id';
    return this.customersService.getDashboardStats(userId);
  }
}
