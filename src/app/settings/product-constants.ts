// Define the shape of the inner objects
interface ProductComponents {
  specificationComponents: string[]
  calculationComponents: string[]
  fabricationComponents: string[]
}

// Define the main map type
type productFieldMapType = {
  [key: string]: ProductComponents
}

// Create the productFieldMap object with the correct type
export const productFieldMap: productFieldMapType = {
  'Paperback Books': {
    specificationComponents: [
      'closeSize',
      'openSize',
      'cover',
      'text',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'coverCalculation',
      'textCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['paperbackBookBinding', 'coverUV', 'vdp'],
  },

  Catalogs: {
    specificationComponents: [
      'closeSize',
      'openSize',
      'cover',
      'text',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'coverCalculation',
      'textCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['catalogBrochureBinding', 'coverUV'],
  },
  Brochures: {
    specificationComponents: [
      'closeSize',
      'openSize',
      'cover',
      'text',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'coverCalculation',
      'textCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['catalogBrochureBinding', 'coverUV'],
  },
}
