import { Module } from '@nestjs/common';
import { PickupsService } from './pickups.service';
import { PickupsController } from './pickups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, NotificationsModule, CloudinaryModule],
  controllers: [PickupsController],
  providers: [PickupsService],
})
export class PickupsModule {}