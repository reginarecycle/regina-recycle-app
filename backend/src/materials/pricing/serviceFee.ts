export abstract class ServiceFee {
    protected feeType: string;
    protected feeValue: number;
    protected collectorId: string;

    constructor(feeType: string, feeValue: number, collectorId: string) {
        this.feeType = feeType;
        this.feeValue = feeValue;
        this.collectorId = collectorId;
    }

    abstract calculate(amount: number): number;

    getFeeType(): string {
        return this.feeType;
    }

    getFeeValue(): number {
        return this.feeValue;
    }

    getCollectorId(): string {
        return this.collectorId;
    }
}