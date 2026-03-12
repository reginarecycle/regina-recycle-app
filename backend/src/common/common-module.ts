import { Module } from '@nestjs/common';
import { CollectorGuard } from 'src/auth/guards/collector.guard';
import { CustomerGuard } from 'src/auth/guards/customer.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';


@Module({
  providers: [JwtAuthGuard, RolesGuard, CustomerGuard, CollectorGuard],
  exports: [JwtAuthGuard, RolesGuard, CustomerGuard, CollectorGuard],
})
export class CommonModule {}