import { ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto';

export class MaterialQueryDto extends PaginationDto{

    @ApiPropertyOptional({example: 'plastic'})
    @IsOptional()
    @IsString()
    search?:string;

    @ApiPropertyOptional({example: 'plastic'})
    @IsOptional()
    @IsString()
    type?:string;

}
