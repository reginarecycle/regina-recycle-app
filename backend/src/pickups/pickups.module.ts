import { Module } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { PickupsController } from './pickups.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [PrismaModule, WalletModule],
  controllers: [PickupsController],
  providers: [PickupsService],
})
export class PickupsModule {}
