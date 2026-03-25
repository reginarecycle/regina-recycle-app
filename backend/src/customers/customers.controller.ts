import { Controller, Get, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Auth } from '../common/decorator/auth.decorator';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('dashboard-stats')
  @Auth('CUSTOMER')
  @ApiOperation({ summary: 'Get customer dashboard stats' })
  getDashboardStats(@Request() req) {
    return this.customersService.getDashboardStats(req.user.userId);
  }
}