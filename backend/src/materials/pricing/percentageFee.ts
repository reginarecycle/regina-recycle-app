import { ServiceFee } from './serviceFee';

export class PercentageFee extends ServiceFee {
  constructor(feeValue: number) {
    super('PERCENTAGE_FEE', feeValue);
  }

  calculate(amount: number): number {
    return amount * (this.feeValue / 100);
  }
}
