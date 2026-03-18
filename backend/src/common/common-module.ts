import { Module } from '@nestjs/common';
import { CollectorGuard } from '../auth/guards/collector.guard';
import { CustomerGuard } from '../auth/guards/customer.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/role.guard';


@Module({
  providers: [JwtAuthGuard, RolesGuard, CustomerGuard, CollectorGuard],
  exports: [JwtAuthGuard, RolesGuard, CustomerGuard, CollectorGuard],
})
export class CommonModule {}