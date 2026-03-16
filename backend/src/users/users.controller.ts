import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query,Req  } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard) // apply to all routes
@Controller('users')

export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    return this.usersService.getProfile(userId);
  }

  @Get('basic-info')
  getBasicInfo(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    return this.usersService.getUserBasicInfo(userId);
  }

  @Get('addresses')
  getUserAddresses(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    return this.usersService.getUserAddresses(userId);
  }

  
  @Get('notifications')
  getNotificationPreferences(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    return this.usersService.getNotificationPreferences(userId);
  }


  @Patch('notifications')
  updateNotificationPreferences(@Req() req: any, @Body() data: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    return this.usersService.updateNotificationPreferences(userId, data);
  }



  @Patch('profile')
  updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;// Replace with actual user ID from the request context
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Patch('deactivate')
  deactivateAccount(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    // Implement logic to deactivate the user's account
    return this.usersService.deactivateAccount(userId);
  }

  @Delete('delete')
  deleteAccount(@Req() req: any) {
    const userId = req.user.userId; // Replace with actual user ID from the request context
    // Implement logic to delete the user's account
    return this.usersService.deleteAccount(userId); 
  }

}