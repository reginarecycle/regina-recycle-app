import { PartialType } from '@nestjs/swagger';
import { CreateMaterialPricingDto } from './create-material-pricing.dto';

export class UpdateMaterialPricingDto extends PartialType(CreateMaterialPricingDto) {}
