import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto';

export class PickupQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'ACCEPTED' })
  @IsOptional()
  @IsString()
  status?: string;
}