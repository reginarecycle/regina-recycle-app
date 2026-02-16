import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards() // Add your authentication guard here
  getProfile() {
    const userId = 'temp-user-id'; // Replace with actual user ID from the request context
    return this.usersService.getProfile(userId);
  }

  @Patch('profile')
  @UseGuards() // Add your authentication guard here
  updateProfile(@Body() updateUserDto: UpdateUserDto) {
    const userId = 'temp-user-id'; // Replace with actual user ID from the request context
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Patch('deactivate')
  @UseGuards() // Add your authentication guard here
  deactivateAccount() {
    const userId = 'temp-user-id'; // Replace with actual user ID from the request context
    // Implement logic to deactivate the user's account
    return this.usersService.deactivateAccount(userId);
  }

  @Delete('delete')
  @UseGuards() // Add your authentication guard here
  deleteAccount() {
    const userId = 'temp-user-id'; // Replace with actual user ID from the request context
    // Implement logic to delete the user's account
    return this.usersService.deleteAccount(userId); 
  }

}