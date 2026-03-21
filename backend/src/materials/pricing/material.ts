export class Material {

protected materialId: string;
protected name: string;
protected type: string;
protected basePrice: number;
protected bulkRate: number;

constructor (
materialId: string,
name: string,
type: string,
basePrice: number,
bulkRate: number
) {
this.materialId = materialId;
this.name = name;
this.type = type;
this.basePrice = basePrice;
this.bulkRate = bulkRate;
}

// Getters
getMaterialId(): string {
return this.materialId;
}

getName(): string {
return this.name;
}

getType(): string {
return this.type;
}

getBasePrice(): number {
return this.basePrice;
}

getBulkRate(): number {
return this.bulkRate;
}

// Setters (used by collector/admin role)
setBasePrice(basePrice: number): void {
this.basePrice = basePrice;
}

setBulkRate(bulkRate: number): void {
this.bulkRate = bulkRate;
}
}
