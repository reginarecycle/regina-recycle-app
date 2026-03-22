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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/profile
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  // PATCH /users/profile
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  // PATCH /users/deactivate
  @Patch('deactivate')
  @HttpCode(HttpStatus.OK)
  deactivateAccount(@Req() req: any) {
    return this.usersService.deactivateAccount(req.user.userId);
  }

  // GET /users/delete/check
  @Get('delete/check')
  checkDeleteEligibility(@Req() req: any) {
    return this.usersService.checkDeleteEligibility(req.user.userId);
  }

  // DELETE /users/delete
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  deleteAccount(@Req() req: any) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}