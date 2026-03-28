import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  ValidateIf,
  IsNumber,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Matches,
} from 'class-validator';
import { Role } from '@prisma/client';
import { AddressDto } from '../../addresses/dto/address.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'passwordStrength', async: false })
class PasswordStrengthConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const object = args.object as RegisterDto;
    if (object.role === Role.COLLECTOR) return true;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  }
  defaultMessage() {
    return 'Password must contain uppercase, lowercase, number and special character';
  }
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Validate(PasswordStrengthConstraint)
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
