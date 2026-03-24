import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEmail, MinLength, IsDateString, ValidateNested, IsNotEmpty } from 'class-validator';
import { AddressDto } from 'src/addresses/dto/address.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    dateOfBirth?: string;
  
    @ApiProperty({ type: () => AddressDto})
    @ValidateNested()
    @Type(() => AddressDto)
    @IsNotEmpty()
    address: AddressDto;
}
