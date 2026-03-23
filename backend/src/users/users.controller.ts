import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: { userId: string };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  // PATCH /users/deactivate
  @Patch('deactivate')
  @HttpCode(HttpStatus.OK)
  deactivateAccount(@Req() req: AuthRequest) {
    return this.usersService.deactivateAccount(req.user.userId);
  }

  @Get('delete/check')
  checkDeleteEligibility(@Req() req: AuthRequest) {
    return this.usersService.checkDeleteEligibility(req.user.userId);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  deleteAccount(@Req() req: AuthRequest) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
