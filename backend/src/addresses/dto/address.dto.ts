import { IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  line1: string;

  @IsString()
  @IsOptional()
  line2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}