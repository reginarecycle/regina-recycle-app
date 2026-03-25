import { IsOptional, IsString } from 'class-validator';


export class RejectPickupDto {
 @IsString()
 reason: string;


 @IsOptional()
 @IsString()
 comment?: string;
}
