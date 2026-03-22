import { ServiceFee } from './serviceFee';
import { FlatFee } from './flatFee';
import { PercentageFee } from './percentageFee';

export class ServiceFeeFactory {
    static create(feeType: string, feeValue: number, collectorId: string): ServiceFee {
        if (feeType.toUpperCase() === 'PERCENTAGE_FEE') {
            return new PercentageFee(feeValue, collectorId);
        } else if (feeType.toUpperCase() === 'FLAT_FEE') {
            return new FlatFee(feeValue, collectorId);
        }

        throw new Error(`Unsupported fee type: ${feeType}`);
    }
}
