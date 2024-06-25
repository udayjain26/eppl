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
  'Annual Reports': {
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
    fabricationComponents: ['paperbackBookBinding', 'coverUV', 'textUV', 'vdp'],
  },
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
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
    ],
  },
  'Swatch Cards': {
    specificationComponents: [
      'openSize',
      'sheetPrinting',
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
    fabricationComponents: [],
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
    fabricationComponents: [
      'catalogBrochureBinding',
      'coverUV',
      'textUV',
      'coverCoating',
      'textCoating',
      'coverFoiling',
      'coverEmbossing',
    ],
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
    fabricationComponents: [
      'catalogBrochureBinding',
      'coverUV',
      'textUV',
      'coverCoating',
      'textCoating',
      'coverFoiling',
      'coverEmbossing',
    ],
  },
  Magazines: {
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
    fabricationComponents: [
      'catalogBrochureBinding',
      'coverUV',
      'textUV',
      'coverFoiling',
      'coverEmbossing',
    ],
  },
  Posters: {
    specificationComponents: [
      'openSize',
      'sheetPrinting',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'sheetPrintingCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['gumming', 'coverUV'],
  },
  Leaflets: {
    specificationComponents: [
      'openSize',
      'sheetPrinting',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'sheetPrintingCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['coverUV'],
  },
  'Both Side Flap Monocartons': {
    specificationComponents: [
      'openSize',
      'sheetPrinting',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'sheetPrintingCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['coverUV', 'coverFoiling', 'coverEmbossing'],
  },
}
