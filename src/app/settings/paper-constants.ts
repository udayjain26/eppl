export const paperTypes = [
  { label: 'Art Card', value: 'art_card' },
  { label: 'Art Paper', value: 'art_paper' },
  { label: 'Board', value: 'board' },
  { label: 'Chromo', value: 'chromo' },
  { label: 'Dalum Recycled', value: 'dalum_recycled' },
  { label: 'Grey Back', value: 'grey_back' },
  { label: 'Gumming Sheet', value: 'gumming_sheet' },
  { label: 'Maplitho A Grade', value: 'maplitho_a_grade' },
  { label: 'Maplitho B Grade', value: 'maplitho_b_grade' },
  { label: 'Maplitho C Grade', value: 'maplitho_c_grade' },
  { label: 'SBS', value: 'sbs' },
  { label: 'Special Fine Paper', value: 'special_fine_paper' },
  { label: 'Whiteback', value: 'whiteback' },
  { label: 'Bond Paper', value: 'bond_paper' },
  { label: 'Kraft Paper', value: 'kraft_paper' },
  { label: 'Newsprint', value: 'newsprint' },
  { label: 'Recycled Paper', value: 'recycled_paper' },
  { label: 'Handmade Paper', value: 'handmade_paper' },
  { label: 'Wove Paper', value: 'wove_paper' },
  { label: 'Folding Box Board', value: 'folding_box_board' },
  { label: 'LWC (Light Weight Coated)', value: 'lwc' },
  { label: 'Virgin Kraft Paper', value: 'virgin_kraft_paper' },
  { label: 'Thermal Paper', value: 'thermal_paper' },
]

type PaperMill = {
  label: string
  qualities: string[]
}

export const paperMills: PaperMill[] = [
  {
    label: 'Bilt',
    qualities: [
      'Magna Print',
      'Sunshine Super Printing(HB)',
      'Sunshine Super Printing White',
      'TA Maplitho Premium',
      'TA Maplitho Natural Shade(High Bright)',
      'Others',
    ],
  },
  {
    label: 'Ruchira',
    qualities: ['Surface Size', 'Maplitho Paper', 'Others'],
  },
  {
    label: 'Shreyans',
    qualities: [
      'High Bright',
      'Cream Wove',
      'Surface Size',
      'Maplitho Paper',
      'Others',
    ],
  },
  {
    label: 'Khanna',
    qualities: [
      'Elegance Super Print',
      'Optima Maplitho',
      'Grafika Super Print',
      'Eco Brite Plus',
      'Others',
    ],
  },
  { label: 'Nevia', qualities: ['Others'] },
  { label: 'Hikote', qualities: ['Others'] },
  { label: 'ChingMing', qualities: ['Others'] },
  { label: 'Sripathi', qualities: ['Others'] },
  {
    label: 'JK',
    qualities: [
      'JK Elektra',
      'JK SHB',
      'JK Lumina',
      'JK Finesse',
      'Sirpur Natura SS',
      'JK SHB NS',
      'JK Ledger',
      'JK Art Paper',
      'JK Ultima',
      'JK Endura',
      'JK Tuffcote',
      'Others',
    ],
  },
  { label: 'TNPL', qualities: ['Others'] },
  { label: 'ITC', qualities: ['Others'] },
  {
    label: 'Century',
    qualities: [
      'Century Star',
      'Super Maplitho',
      'Century Maplitho',
      'Super Maplitho',
      'Century Premium',
      'Century Book Printing NS',
      'Century FBB',
      'Century SBS',
      'Century Grey Back',
      'Others',
    ],
  },
  { label: 'Star', qualities: ['Others'] },
  { label: 'Sangal', qualities: ['Others'] },
  { label: 'Fedregoni', qualities: ['Others'] },
  { label: 'Cordenons', qualities: ['Others'] },
  { label: 'Sappi', qualities: ['Others'] },
  { label: 'Stora Enso', qualities: ['Others'] },
  {
    label: 'Holmen',
    qualities: ['Holmen High Bulk', 'Others'],
  },
  { label: 'Smurfit Kappa', qualities: ['Others'] },
  { label: 'Reel Cut', qualities: ['Standard', 'Others'] },
  { label: 'Prime', qualities: ['Standard', 'Others'] },
]

export const paperFinishes = [
  { label: 'Gloss', value: 'gloss' },
  { label: 'Matte', value: 'matte' },
  { label: 'Silk', value: 'silk' },
  { label: 'Uncoated', value: 'uncoated' },
  { label: 'Coated One Side', value: 'coated_one_side' },
  { label: 'Fine Paper', value: 'fine_paper' },
  { label: 'Others', value: 'others' },
]
