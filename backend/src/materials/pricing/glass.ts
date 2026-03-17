import { Material } from "./material";
export class Glass extends Material {

constructor() {
super(1, "Glass", "Recyclable", 5, 0.8);
}

estimateCost(qty: number): number {
if (!this.validate(qty)) {
throw new Error("Quantity must be greater than 0");
}

const basePrice = this.getBasePrice();
const bulkRate = this.getBulkRate();

if (qty >= 10) {
return qty * basePrice * bulkRate;
}

return qty * basePrice;
}
}
