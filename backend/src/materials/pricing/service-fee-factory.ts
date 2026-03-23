import { BadRequestException } from '@nestjs/common';
import { ServiceFee } from './serviceFee';
import { FlatFee } from './flatFee';
import { PercentageFee } from './percentageFee';

export class ServiceFeeFactory {
  static create(feeType: string, feeValue: number): ServiceFee {
    switch (feeType.toUpperCase()) {
      case 'FLAT_FEE':       return new FlatFee(feeValue);
      case 'PERCENTAGE_FEE': return new PercentageFee(feeValue);
      default: throw new BadRequestException(`Unsupported fee type: ${feeType}`);
    }
  }
}
