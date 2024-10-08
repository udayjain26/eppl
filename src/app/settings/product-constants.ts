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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'textUV',
      'coverCoating',
      'textCoating',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
  },
  Notebooks: {
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
  },
  'Coffee Table Books': {
    specificationComponents: [
      'closeSize',
      'openSize',
      'cover',
      'board',
      'text',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'coverCalculation',
      'boardCalculation',
      'textCalculation',
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'coverCoating',
      'textCoating',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
  },
  'Hardbound Books': {
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'coverCoating',
      'textCoating',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
  },
  'Hardbound Diaries': {
    specificationComponents: [
      'closeSize',
      'openSize',
      'cover',
      'board',
      'text',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'coverCalculation',
      'boardCalculation',
      'textCalculation',
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'coverCoating',
      'textCoating',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
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
      'sheetPrintingCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: ['coverDieCutting'],
  },
  'Tent Cards': {
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
    fabricationComponents: ['coverDieCutting', 'making'],
  },
  Danglers: {
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
    fabricationComponents: ['coverDieCutting', 'making'],
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
      'secondaryTextCalculation',
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
      'coverDieCutting',
      'textDieCutting',
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
      'secondaryTextCalculation',
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
      'coverDieCutting',
      'textDieCutting',
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'catalogBrochureBinding',
      'coverUV',
      'textUV',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
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
    fabricationComponents: ['gumming', 'coverUV', 'coverDieCutting'],
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
    fabricationComponents: ['coverUV', 'coverDieCutting'],
  },
  Letterhead: {
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
    fabricationComponents: ['coverUV', 'coverDieCutting'],
  },
  Envelopes: {
    specificationComponents: [
      'closeSize',
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
    fabricationComponents: ['coverUV', 'coverDieCutting', 'making'],
  },
  'Paper Carry Bags': {
    specificationComponents: [
      'closeSize',
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
    fabricationComponents: ['coverUV', 'coverDieCutting', 'making'],
  },
  Folders: {
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
    fabricationComponents: ['coverUV', 'coverDieCutting', 'coverCoating'],
  },
  Dockets: {
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
    fabricationComponents: ['coverUV', 'coverDieCutting', 'coverCoating'],
  },
  "Centre Pin Children's Books": {
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'catalogBrochureBinding',
      'coverUV',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
  },
  "Paperback Children's Books": {
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
      'secondaryTextCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'paperbackBookBinding',
      'coverUV',
      'vdp',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'textDieCutting',
    ],
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
    fabricationComponents: [
      'coverUV',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'making',
    ],
  },
  'Lock Bottom Monocartons': {
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
    fabricationComponents: [
      'coverUV',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
    ],
  },
  'Card Sleeve Cases': {
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
    fabricationComponents: [
      'coverUV',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'making',
    ],
  },
  'Top Bottom Rigid Box': {
    specificationComponents: [
      'openSize',
      'sheetPrinting',
      'board',
      'fabrication',
      'packaging',
      'dispatch',
    ],
    calculationComponents: [
      'totalCalculation',
      'sheetPrintingCalculation',
      'boardCalculation',
      'fabricationCalculation',
      'packagingCalculation',
    ],
    fabricationComponents: [
      'coverUV',
      'coverFoiling',
      'coverEmbossing',
      'coverDieCutting',
      'making',
    ],
  },
}
