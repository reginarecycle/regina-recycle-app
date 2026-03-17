import { Material } from "./material";
export class Batteries extends Material {

private hazardousFee: number = 5;

constructor() {
super(2, "Batteries", "hazardous", 6, 0.9);
}
estimateCost(qty: number): number {

if (!this.validate(qty)) {
throw new Error("Quantity must be greater than 0");
}
const basePrice = this.getBasePrice();
const bulkRate = this.getBulkRate();

let cost = qty * this.basePrice;
if (qty >= 10) {
cost = cost * this.bulkRate;
}
return cost + this.hazardousFee;
}
}
