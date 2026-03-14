export type PickupMaterialDetails = {
  materialName: string;
  type: string;
  estimatedCostPerUnit: number;
};

export class PickupMaterialFactory {
  static selectPickupMaterial(name: string): PickupMaterialDetails {
    switch (name.toLowerCase()) {
      case 'glass':
        return {
          materialName: 'glass',
          type: 'recyclable',
          estimatedCostPerUnit: 5,
        };

      case 'cardboard':
        return {
          materialName: 'cardboard',
          type: 'recyclable',
          estimatedCostPerUnit: 2,
        };

      default:
        throw new Error(`Unsupported material: ${name}`);
    }
  }
}