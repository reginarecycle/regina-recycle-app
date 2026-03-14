import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsDateString,
  Matches,
  IsBoolean,
  Validate,
  ValidateNested,
  IsNotEmpty,
  ValidateIf,
  Length,
  IsNumber,
} from 'class-validator';
import { Role } from '@prisma/client';
import { AddressDto } from '../../addresses/dto/address.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  @Validate((value: boolean) => value === true, {
    message: 'You must agree to the terms and conditions',
  })
  agreedToTerms: boolean;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;

  // Collector only
  @ValidateIf((o) => o.role === 'COLLECTOR')
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9}$/, { message: 'License ID must be 9 digits' })
  licenseId?: string;

  @IsNumber()
  @IsOptional()
  serviceFee?: number;
}
