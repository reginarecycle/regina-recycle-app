export abstract class ServiceFee {
  constructor(
    protected readonly feeType: string,
    protected readonly feeValue: number,
  ) {}

  abstract calculate(amount: number): number;
}
