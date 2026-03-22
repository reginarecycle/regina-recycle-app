import { ServiceFee } from './serviceFee';

export class FlatFee extends ServiceFee {

    constructor(feeValue: number, collectorId: string) {
        super("FLAT_FEE", feeValue, collectorId);
    }

    calculate(amount: number): number {
        return this.feeValue;
    }
}