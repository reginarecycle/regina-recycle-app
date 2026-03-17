import { Material } from "./material";
import { Glass } from "./glass";
import { Batteries } from "./batteries";
export class MaterialPricingFactory {

createMaterial(type: string): Material {

if (type === "glass") {
return new Glass();
}

if (type === "batteries") {
return new Batteries();
}

throw new Error("Unknown material type");
}
}
