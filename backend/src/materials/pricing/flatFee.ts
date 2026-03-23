import { ServiceFee } from './serviceFee';

export class FlatFee extends ServiceFee {
  constructor(feeValue: number) {
    super('FLAT_FEE', feeValue);
  }

  calculate(_amount: number): number {
    return this.feeValue;
  }
}
