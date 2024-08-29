//Lamination rates are in rupees per square meter

import { Label } from 'react-konva'

// Velet : 1550*32 sqinch per kilo

//

export const laminations = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: 'Both Side Thermal Matte',
    value: 'both_side_thermal_matte',
    rate: 20.7,
  },
  {
    label: 'Single Side Thermal Matte',
    value: 'single_side_thermal_matte',
    rate: 10.35,
  },
  {
    label: 'Both Side Thermal Gloss',
    value: 'both_side_thermal_gloss',
    rate: 14,
  },
  {
    label: 'Single Side Thermal Gloss',
    value: 'single_side_thermal_gloss',
    rate: 7.0,
  },

  {
    label: 'Both Side Normal Matte',
    value: 'both_side_normal_matte',
    rate: 10.35,
  },
  {
    label: 'Single Side Normal Matte',
    value: 'single_side_normal_matte',
    rate: 5.2,
  },

  {
    label: 'Both Side Normal Gloss',
    value: 'both_side_normal_gloss',
    rate: 8.9,
  },
  {
    label: 'Single Side Normal Gloss',
    value: 'single_side_normal_gloss',
    rate: 4.45,
  },

  {
    label: 'Both Side Thermal Velvet',
    value: 'both_side_thermal_velvet',
    rate: 50,
  },
  {
    label: 'Single Side Thermal Velvet',
    value: 'single_side_thermal_velvet',
    rate: 25,
  },

  {
    label: 'Single Side Thermal Metallic',
    value: 'single_side_thermal_metallic',
    rate: 20,
  },
]

// rates are in rupees per meter square qty
export const coatings = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: 'Single Side Aqueous Coating Gloss',
    value: 'single_side_aqueous_coating_gloss',
    rate: 1.9,
  },
  {
    label: 'Both Side Aqueous Coating Gloss',
    value: 'both_side_aqueous_coating_gloss',
    rate: 3.8,
  },
  {
    label: 'Single Side Silky Varnish',
    value: 'single_side_silky_varnish',
    rate: 1.9,
  },
  {
    label: 'Both Side Silky Varnish',
    value: 'both_side_silky_varnish',
    rate: 3.8,
  },
  {
    label: 'Single Side Aqueous Coating Matt',
    value: 'single_side_aqueous_coating_matt',
    rate: 2.25,
  },
  {
    label: 'Both Side Aqueous Coating Matt',
    value: 'both_side_aqueous_coating_matt',
    rate: 4.5,
  },
]

export const commonSizes = [
  { label: 'A0 Portrait', length: 1189, width: 841 },
  { label: 'A0 Landscape', length: 841, width: 1189 },
  { label: 'A1 Portrait', length: 841, width: 594 },
  { label: 'A1 Landscape', length: 594, width: 841 },
  { label: 'A2 Portrait', length: 594, width: 420 },
  { label: 'A2 Landscape', length: 420, width: 594 },
  { label: 'A3 Portrait', length: 420, width: 297 },
  { label: 'A3 Landscape', length: 297, width: 420 },
  { label: 'A4 Portrait', length: 297, width: 210 },
  { label: 'A4 Landscape', length: 210, width: 297 },
  { label: 'A5 Portrait', length: 210, width: 148 },
  { label: 'A5 Landscape', length: 148, width: 210 },
  { label: 'A6 Portrait', length: 148, width: 105 },
  { label: 'A6 Landscape', length: 105, width: 148 },
  { label: 'A7 Portrait', length: 105, width: 74 },
  { label: 'A7 Landscape', length: 74, width: 105 },
  { label: 'A8 Portrait', length: 74, width: 52 },
  { label: 'A8 Landscape', length: 52, width: 74 },
  { label: 'A9 Portrait', length: 52, width: 37 },
  { label: 'A9 Landscape', length: 37, width: 52 },
  { label: 'A10 Portrait', length: 37, width: 26 },
  { label: 'A10 Landscape', length: 26, width: 37 },
  { label: 'B0 Portrait', length: 1414, width: 1000 },
  { label: 'B0 Landscape', length: 1000, width: 1414 },
  { label: 'B1 Portrait', length: 1000, width: 707 },
  { label: 'B1 Landscape', length: 707, width: 1000 },
  { label: 'B2 Portrait', length: 707, width: 500 },
  { label: 'B2 Landscape', length: 500, width: 707 },
  { label: 'B3 Portrait', length: 500, width: 353 },
  { label: 'B3 Landscape', length: 353, width: 500 },
  { label: 'B4 Portrait', length: 353, width: 250 },
  { label: 'B4 Landscape', length: 250, width: 353 },
  { label: 'B5 Portrait', length: 250, width: 176 },
  { label: 'B5 Landscape', length: 176, width: 250 },
  { label: 'B6 Portrait', length: 176, width: 125 },
  { label: 'B6 Landscape', length: 125, width: 176 },
  { label: 'B7 Portrait', length: 125, width: 88 },
  { label: 'B7 Landscape', length: 88, width: 125 },
  { label: 'B8 Portrait', length: 88, width: 62 },
  { label: 'B8 Landscape', length: 62, width: 88 },
  { label: 'B9 Portrait', length: 62, width: 44 },
  { label: 'B9 Landscape', length: 44, width: 62 },
  { label: 'B10 Portrait', length: 44, width: 31 },
  { label: 'B10 Landscape', length: 31, width: 44 },
  { label: 'C0 Portrait', length: 1297, width: 917 },
  { label: 'C0 Landscape', length: 917, width: 1297 },
  { label: 'C1 Portrait', length: 917, width: 648 },
  { label: 'C1 Landscape', length: 648, width: 917 },
  { label: 'C2 Portrait', length: 648, width: 458 },
  { label: 'C2 Landscape', length: 458, width: 648 },
  { label: 'C3 Portrait', length: 458, width: 324 },
  { label: 'C3 Landscape', length: 324, width: 458 },
  { label: 'C4 Portrait', length: 324, width: 229 },
  { label: 'C4 Landscape', length: 229, width: 324 },
  { label: 'C5 Portrait', length: 229, width: 162 },
  { label: 'C5 Landscape', length: 162, width: 229 },
  { label: 'C6 Portrait', length: 162, width: 114 },
  { label: 'C6 Landscape', length: 114, width: 162 },
  { label: 'C7 Portrait', length: 114, width: 81 },
  { label: 'C7 Landscape', length: 81, width: 114 },
  { label: 'C8 Portrait', length: 81, width: 57 },
  { label: 'C8 Landscape', length: 57, width: 81 },
  { label: 'C9 Portrait', length: 57, width: 40 },
  { label: 'C9 Landscape', length: 40, width: 57 },
  { label: 'C10 Portrait', length: 40, width: 28 },
  { label: 'C10 Landscape', length: 28, width: 40 },
  { label: 'Letter Portrait', length: 279.4, width: 215.9 },
  { label: 'Letter Landscape', length: 215.9, width: 279.4 },
  { label: 'Legal Portrait', length: 355.6, width: 215.9 },
  { label: 'Legal Landscape', length: 215.9, width: 355.6 },
  { label: 'Tabloid Portrait', length: 431.8, width: 279.4 },
  { label: 'Tabloid Landscape', length: 279.4, width: 431.8 },
  { label: 'Ledger Portrait', length: 279.4, width: 431.8 },
  { label: 'Ledger Landscape', length: 431.8, width: 279.4 },
  { label: 'Executive Portrait', length: 266.7, width: 184.1 },
  { label: 'Executive Landscape', length: 184.1, width: 266.7 },
  { label: 'Folio Portrait', length: 330.2, width: 215.9 },
  { label: 'Folio Landscape', length: 215.9, width: 330.2 },
  { label: 'Quarto Portrait', length: 254, width: 203.2 },
  { label: 'Quarto Landscape', length: 203.2, width: 254 },
  { label: 'Postcard Portrait', length: 148, width: 105 },
  { label: 'Postcard Landscape', length: 105, width: 148 },
  { label: 'Index Card Portrait', length: 127, width: 76.2 },
  { label: 'Index Card Landscape', length: 76.2, width: 127 },
  { label: 'Custom', length: 0, width: 0 },
]

// rates are in rupees per 1000 qty per form
export const paperbackBindingTypes = [
  {
    label: 'Centre Pin',
    value: 'centre_pin',
    rate: 0.25,
    minimumPerBook: 1,
  },
  { label: 'Perfect', value: 'perfect_binding', rate: 200, minimumPerBook: 2 },
  {
    label: 'Sewn and Perfect',
    value: 'sewn_and_perfect',
    rate: 400,
    minimumPerBook: 4,
  },
  {
    label: 'Side Pin and Perfect',
    value: 'side_pin_and_perfect',
    rate: 225,
    minimumPerBook: 2.25,
  },
]

export const packagingTypes = [
  { label: 'Standard', value: 'none', rate: 2.25 },
  { label: 'New Cartons', value: 'new_carton', rate: 4.5 },
  { label: 'Shrink Wrap Induvidual', value: 'shrink_wrap_induvidual', rate: 3 },
  { label: 'Shrink Wrap', value: 'Shrink_wrap', rate: 5 },
]

export const catalogBrochureBindingTypes = [
  {
    label: 'Centre Pin',
    value: 'centre_pin',
    rate: 0.25,
    minimumPerBook: 1,
  },

  {
    label: 'Perfect',
    value: 'perfect_binding',
    rate: 225,
    minimumPerBook: 2.25,
  },
  {
    label: 'Sewn and Perfect',
    value: 'sewn_and_perfect',
    rate: 450,
    minimumPerBook: 4.5,
  },
  {
    label: 'Side Pin and Perfect',
    value: 'side_pin_and_perfect',
    rate: 250,
    minimumPerBook: 2.5,
  },
]

export const postpressProcesses = [
  { label: 'None', value: 'none', rate: 0 },
  { label: '1Fold', value: '1fold', rate: 100 },
  { label: '2Fold', value: '2fold', rate: 100 },
  { label: '3Fold', value: '3fold', rate: 125 },
  { label: 'Gathering', value: 'gathering', rate: 75 },
  { label: 'Insertion', value: 'insertion', rate: 250 },

  // { label: 'Perforation', value: 'perforation', rate: 50 },
  // { label: 'Punching', value: 'punching', rate: 50 },
  // { label: 'Stapling', value: 'stapling', rate: 50 },
  // { label: 'Trimming', value: 'trimming', rate: 50 },
  // { label: 'Wire-O Binding', value: 'wire_o_binding', rate: 100 },
]

export const makingProcesses = [
  { label: 'Envelope Making', value: 'envelope_making', rate: 300 },
  { label: 'Tentcard Making', value: 'tentcard_making', rate: 1500 },
  { label: 'Dangler Making', value: 'dangler_making', rate: 2500 },
  { label: 'Monocarton Making', value: 'monocarton_making', rate: 4000 },

  {
    label: 'Carrybag Double Pasting',
    value: 'carrybag_double_pasting',
    rate: 6000,
  },
  {
    label: 'Carrybag Single Pasting',
    value: 'carrybag_single_pasting',
    rate: 5000,
  },
  {
    label: 'Simple Sleeve Case',
    value: 'carrybag_single_pasting',
    rate: 1500,
  },
  {
    label: 'Complex Sleeve Case',
    value: 'carrybag_single_pasting',
    rate: 2500,
  },
]

// uvTypes rates are per qty
export const uvTypes = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: 'Spot UV',
    value: 'spot_uv',
    smallSheetRate: 2.0,
    bigSheetRate: 2.5,
    smallFixedCharge: 1500,
    bigFixedCharge: 2500,
  },
  {
    label: 'Full UV',
    value: 'full_uv',
    smallSheetRate: 1.5,
    bigSheetRate: 3,
    smallFixedCharge: 1000,
    bigFixedCharge: 1500,
  },
  {
    label: 'Hybrid UV',
    value: 'hybrid_uv',
    smallSheetRate: 2.5,
    bigSheetRate: 5,
    smallFixedCharge: 500,
    bigFixedCharge: 500,
  },
  {
    label: 'Crystal UV',
    value: 'crystal_uv',
    smallSheetRate: 1.5,
    bigSheetRate: 2.5,
    smallFixedCharge: 1500,
    bigFixedCharge: 2500,
  },
  {
    label: 'Hybrid + Emboss UV',
    value: 'hybrid_emboss_uv',
    smallSheetRate: 5.5,
    bigSheetRate: 11,
    smallFixedCharge: 1500,
    bigFixedCharge: 2500,
  },
]

// rates are in rupees per 1000 qty
export const embossingTypes = [
  { label: 'None', value: 'none', rate: 0 },
  { label: 'Embossing', value: 'embossing', rate: 350, blockRate: 1000 },
  { label: 'Debossing', value: 'debossing', rate: 350, blockRate: 1000 },
]

//Rates in rupeess per meter square
export const leafingTypes = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: 'Standard Foil',
    value: 'standard_foiling',
    rate: 5,
    blockRate: 1000,
  },
  {
    label: 'Rainbow Silver',
    value: 'rainbow_silver',
    rate: 20,
    blockRate: 1000,
  },
  { label: 'Rainbow Gold', value: 'rainbow_gold', rate: 20, blockRate: 1000 },
]

// rates are in rupees per qty
export const vdpTypes = [
  { label: 'None', value: 'none', rate: 0 },
  { label: 'VDP 1 Color', value: 'vdp_1_color', rate: 2 },
  { label: 'VDP 4 Color', value: 'vdp_4_color', rate: 8 },
  { label: 'VDP and Scratch', value: 'vdp_and_scratch', rate: 3 },
]

// rates are in rupees per 1000 qty
export const dieCuttingTypes = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: 'Simple Die Cutting',
    value: 'simple_die_cutting',
    rate: 350,
    dieCost: 1000,
  },
  {
    label: 'Monocarton Die Cutting',
    value: 'monocarton_die_cutting',
    rate: 500,
    dieCost: 2000,
  },
  {
    label: 'Complex Die Cutting',
    value: 'complex_die_cutting',
    rate: 400,
    dieCost: 2000,
  },
  {
    label: 'Laser Die Cutting',
    value: 'laser_die_cutting',
    rate: 400,
    dieCost: 2000,
  },
  {
    label: 'Creasing',
    value: 'creasing',
    rate: 300,
    dieCost: 1000,
  },
]

export const gummingTypes = [
  { label: 'None', value: 'none', rate: 0 },
  {
    label: '1 Strip Gumming 1 inch',
    value: 'one_strip_gumming_1_inch',
    rate: 1.5,
  },
  {
    label: '2 Strip Gumming 1 inch',
    value: 'two_strip_gumming_1_inch',
    rate: 3,
  },
  {
    label: '3 Strip Gumming 1 inch',
    value: 'three_strip_gumming_1_inch',
    rate: 4.5,
  },
  {
    label: '1 Strip Gumming 1.5 inch',
    value: 'one_strip_gumming_1_5_inch',
    rate: 2.25,
  },
  {
    label: '2 Strip Gumming 1.5 inches',
    value: 'two_strip_gumming_1_5_inch',
    rate: 4.5,
  },
  {
    label: '3 Strip Gumming 1.5 inches',
    value: 'three_strip_gumming_1_5_inch',
    rate: 6.75,
  },
  {
    label: '1 Strip Gumming 2 inch',
    value: 'one_strip_gumming_2_inch',
    rate: 3,
  },
  {
    label: '2 Strip Gumming 2 inches',
    value: 'two_strip_gumming_2_inch',
    rate: 6,
  },
  {
    label: '3 Strip Gumming 2 inches',
    value: 'three_strip_gumming_2_inch',
    rate: 9,
  },
]
