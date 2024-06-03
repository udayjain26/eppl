// Define the shape of the inner objects
interface ProductComponents {
  specificationComponents: string[]
  calculationComponents: string[]
}

// Define the main map type
type productFieldMapType = {
  [key: string]: ProductComponents
}

// Create the productFieldMap object with the correct type
export const productFieldMap: productFieldMapType = {
  'Paperback Books': {
    specificationComponents: ['closeSize', 'openSize', 'cover', 'text'],
    calculationComponents: ['coverCalculation', 'textCalculation'],
  },
  Posters: {
    specificationComponents: ['size'],
    calculationComponents: [],
  },
}
