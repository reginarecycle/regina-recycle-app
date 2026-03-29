import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CompletePickupItemDto {
  @ApiProperty({ example: 'uuid-of-material' })
  @IsString()
  @IsNotEmpty()
  materialId: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class CompletePickupDto {
  @ApiProperty({ type: [CompletePickupItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletePickupItemDto)
  items?: CompletePickupItemDto[];
}
