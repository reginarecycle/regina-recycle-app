import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { CollectorsModule } from './collectors/collectors.module';
import { PickupsModule } from './pickups/pickups.module';
import { MaterialsModule } from './materials/materials.module';
import { WalletModule } from './wallet/wallet.module';
import { AddressesModule } from './addresses/addresses.module';
import { NotificationsModule } from './notifications/notifications.module';
@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CustomersModule, CollectorsModule, AddressesModule, PickupsModule, MaterialsModule, WalletModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
