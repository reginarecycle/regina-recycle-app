import { Module } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { PickupsController } from './pickups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

import { CollectorsModule } from '../collectors/collectors.module';

@Module({
  imports: [PrismaModule, NotificationsModule, CloudinaryModule, CollectorsModule],
  controllers: [PickupsController],
  providers: [PickupsService],
})
export class PickupsModule {}