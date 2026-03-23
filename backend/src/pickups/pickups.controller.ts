import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PickupsService } from './pickups.service';
import { CreatePickupDto } from './dto/create-pickup.dto';
import { UpdatePickupDto } from './dto/update-pickup.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Auth } from 'src/common/decorator/auth.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PickupQueryDto } from './dto/pickup-query.dto';

@ApiTags('Pickups')
@UseGuards(JwtAuthGuard)
@Controller('pickups')
export class PickupsController {
  constructor(
    private readonly pickupsService: PickupsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @ApiOperation({ summary: 'Schedule a pickup' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: { type: 'string', format: 'binary' },
        data: { type: 'string', description: 'JSON string of CreatePickupDto' },
      },
    },
  })
  @Post()
  @Auth('CUSTOMER')
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async createPickup(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string,
  ) {
    let photoUrl: string | undefined = undefined;
    if (file) {
      photoUrl = await this.cloudinaryService.uploadImage(file);
    }
    const createPickupDto: CreatePickupDto = JSON.parse(data);
    return this.pickupsService.create(req.user.userId, createPickupDto, photoUrl);
  }

  @ApiOperation({ summary: 'Get all pickups for logged in user' })
@Get()
@Auth('CUSTOMER')
getUserPickups(@Request() req, @Query() query: PickupQueryDto) {
  return this.pickupsService.findAll(req.user.userId, query);
}

@ApiOperation({ summary: 'Get all pickup requests (collector)' })
@Get('requests')
@Auth('COLLECTOR')
getRequests(@Query() query: PickupQueryDto) {
  return this.pickupsService.getRequests(query);
}

  @ApiOperation({ summary: 'Get available pickup slots for a month' })
  @Get('available-slots')
  @Auth()
  getAvailableSlots(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.pickupsService.getAvailableSlots(Number(month), Number(year));
  }

  @ApiOperation({ summary: 'Get a pickup by ID' })
  @Get(':id')
  @Auth()
  getPickupById(@Param('id') id: string) {
    return this.pickupsService.findOne(id);
  }

  @ApiOperation({ summary: 'Accept a pickup (collector)' })
  @Patch(':id/accept')
  @Auth('COLLECTOR')
  acceptPickup(@Param('id') id: string, @Request() req) {
    return this.pickupsService.accept(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Complete a pickup (collector)' })
  @Patch(':id/complete')
  @Auth('COLLECTOR')
  completePickup(@Param('id') id: string, @Request() req) {
    return this.pickupsService.complete(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Update a pickup (customer only, PENDING only)' })
  @Patch(':id')
  @Auth('CUSTOMER')
  updatePickup(@Param('id') id: string, @Request() req, @Body() updatePickupDto: UpdatePickupDto) {
    return this.pickupsService.update(id, req.user.userId, updatePickupDto);
  }

  @ApiOperation({ summary: 'Cancel a pickup' })
  @Delete(':id/cancel')
  @Auth()
  cancelPickup(@Param('id') id: string, @Request() req) {
    return this.pickupsService.cancel(id, req.user.userId);
  }
}