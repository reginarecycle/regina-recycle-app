import { ServiceFee } from './serviceFee';

export class PercentageFee extends ServiceFee {

    constructor(feeValue: number, collectorId: string) {
        super("PERCENTAGE_FEE", feeValue, collectorId);
    }

    calculate(amount: number): number {
        return amount * (this.feeValue / 100);
    }
}