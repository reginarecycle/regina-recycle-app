import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferenceDto {
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    emailPickupReminder?: boolean;
  
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    emailAccountActivity?: boolean;
  
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    emailMarketing?: boolean;       // customer only
  
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    emailPayment?: boolean;         // collector only
  
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    inAppPickupReminder?: boolean;
  
    @ApiPropertyOptional() @IsBoolean() @IsOptional()
    inAppAlerts?: boolean;
  }
