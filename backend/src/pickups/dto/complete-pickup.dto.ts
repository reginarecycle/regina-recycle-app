import {
 IsArray,
 IsInt,
 IsOptional,
 IsString,
 Min,
 ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';


export class CompletePickupItemDto {
 @IsString()
 materialId: string;


 @IsInt()
 @Min(0)
 quantity: number;
}


export class CompletePickupDto {
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => CompletePickupItemDto)
 items: CompletePickupItemDto[];


 @IsOptional()
 @IsString()
 note?: string;
}

