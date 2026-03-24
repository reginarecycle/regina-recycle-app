import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('dashboard-stats')
  @ApiOperation({ summary: 'Get customer dashboard stats' })
  // @UseGuards(JwtAuthGuard, CustomerGuard)
  getDashboardStats(/* @CurrentUser() user: User */) {
    const userId = 'temp-user-id';
    return this.customersService.getDashboardStats(userId);
  }
}