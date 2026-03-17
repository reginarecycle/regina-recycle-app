import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaterialDto {
 @IsString()
 name: string;

 @IsString()
 type: string;


 @IsOptional()
 @IsString()
 photoUrl?: string;


 @IsOptional()
 @Type(() => Number)
 @IsNumber()
 co2Saved?: number;


 @IsOptional()
 @Type(() => Number)
 @IsNumber()
 waterSaved?: number;
}
