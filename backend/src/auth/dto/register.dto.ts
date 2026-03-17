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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least 8 characters...',
  })
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsBoolean()
  agreedToTerms: boolean;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ type: () => AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.role === 'COLLECTOR')
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9}$/, { message: 'License ID must be 9 digits' })
  licenseId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  serviceFee?: number;
}
