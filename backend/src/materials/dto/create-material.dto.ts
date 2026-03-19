import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
@ApiProperty({ example: 'Plastic Bottle' })
 @IsString()
 name: string;

 @ApiProperty({ example: 'plastic' })
 @IsString()
 type: string;

@ApiProperty({ example: 'https://example.com/image.jpg'})
 @IsOptional()
 @IsString()
 photoUrl?: string;

 @ApiProperty({ example: 2.5})
 @IsOptional()
 @Type(() => Number)
 @IsNumber()
 co2Saved?: number;

@ApiProperty({ example: 10 })
 @IsOptional()
 @Type(() => Number)
 @IsNumber()
 waterSaved?: number;
}
