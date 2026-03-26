import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CollectorUsersQueryDto extends PaginationDto {
  // Used by getCustomers, getPricing, and other existing methods
  @ApiPropertyOptional({ example: 'Dylan White' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  // Used by getUsers (new endpoint) — keyword searches name/email/phone
  @ApiPropertyOptional({ example: 'Dylan' })
  @IsOptional()
  @IsString()
  keyword?: string;
}