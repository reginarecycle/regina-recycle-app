import { ApiSchema } from '@nestjs/swagger';
import { IsString, MinLength, Matches, isString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
  })
  newPassword: string;
}
