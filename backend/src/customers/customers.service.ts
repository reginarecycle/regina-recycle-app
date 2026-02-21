import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  getDashboardStats(userId: string) {
    return `This action returns dashboard data for customer with ID: ${userId}`;
  }
}
