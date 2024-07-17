import { gummingTypes, makingProcesses } from '@/app/settings/constants'
import { add } from 'date-fns'
import { relations } from 'drizzle-orm'
import {
  uuid,
  pgTableCreator,
  varchar,
  timestamp,
  index,
  pgEnum,
  boolean,
  integer,
  smallint,
  serial,
  decimal,
  numeric,
  foreignKey,
  text,
} from 'drizzle-orm/pg-core'

// ENUMS used in the application
export const stateEnum = pgEnum('states', [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Jammu and Kashmir',
  'Lakshadweep',
  'Delhi',
  'Puducherry',
  'Ladakh',
])

export const industryEnum = pgEnum('industries', [
  'Agriculture',
  'Automotive',
  'Banking',
  'Biotechnology',
  'Construction',
  'Education ',
  'Energy',
  'Entertainment',
  'Finance',
  'Food and Beverage',
  'Healthcare',
  'Hospitality',
  'Information Technology',
  'Insurance',
  'Manufacturing',
  'Media',
  'Pharmaceutical',
  'Publishing',
  'Real Estate',
  'Retail',
  'Telecommunications',
  'Transportation',
  'Utilities',
])

export const estimateStatusEnum = pgEnum('estimate_status', [
  'Not Started',
  'In Progress',
  'Completed',
])

export const estimateStageEnum = pgEnum('estimate_stage', [
  'Empty',
  'Drafting',
  'Needs Rates',
  'Estimate Approved',
  'Client Decision',
  'Won',
  'Lost',
])

export const createTable = pgTableCreator((name) => `eppl_${name}`)

export const clients = createTable(
  'clients',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    clientFullName: varchar('client_name', { length: 256 }).notNull().unique(),
    clientNickName: varchar('client_nick_name', { length: 256 })
      .notNull()
      .unique(),
    gstin: varchar('gstin', { length: 15 }).unique(),
    clientAddressLine1: varchar('client_address_line1', { length: 256 }),
    clientAddressLine2: varchar('client_address_line2', { length: 256 }),
    clientAddressCity: varchar('client_address_city', { length: 256 }),
    clientAddressState: stateEnum('client_address_state'),
    clientAddressPincode: varchar('client_address_pincode', { length: 6 }),
    clientWebsite: varchar('client_website', { length: 256 }),
    clientIndustry: industryEnum('industry'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    createdBy: varchar('created_by', { length: 256 }),
    updatedBy: varchar('updated_by', { length: 256 }),
  },
  (table) => {
    return {
      nameIdx: index('name_idx').on(table.clientFullName).asc(),
    }
  },
)
export const clientsRelations = relations(clients, ({ many }) => ({
  contacts: many(contacts),
  estimates: many(estimates),
}))

export const contacts = createTable('contacts', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  clientUuid: uuid('client_uuid')
    .references(() => clients.uuid)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }),
  updatedBy: varchar('updated_by', { length: 256 }),
  contactFirstName: varchar('contact_first_name', { length: 256 }).notNull(),
  contactLastName: varchar('contact_last_name', { length: 256 }),
  contactDesignation: varchar('contact_designation', { length: 256 }),
  contactEmail: varchar('contact_email', { length: 256 }),
  contactMobile: varchar('contact_mobile', { length: 15 }),
  isActive: boolean('is_active').default(true).notNull(),
})

export const contactsRelations = relations(contacts, ({ one }) => ({
  client: one(clients, {
    fields: [contacts.clientUuid],
    references: [clients.uuid],
  }),
}))

export const productsType = createTable('products_type', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  productsTypeName: varchar('products_type_name', {
    length: 256,
  })
    .notNull()
    .unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 })
    .default('user_2fdHwaoM6ctXwzacF7sfDpbLsFN')
    .notNull(),
})

export const productsTypeRelations = relations(productsType, ({ many }) => ({
  products: many(products),
}))

export const products = createTable('products', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  productsTypeUuid: uuid('products_type_uuid')
    .references(() => productsType.uuid)
    .notNull(),
  productName: varchar('product_name', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 })
    .default('user_2fdHwaoM6ctXwzacF7sfDpbLsFN')
    .notNull(),
})

export const productsRelations = relations(products, ({ one }) => ({
  productsCategory: one(productsType, {
    fields: [products.productsTypeUuid],
    references: [productsType.uuid],
  }),
}))

export const estimates = createTable('estimates', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  clientUuid: uuid('client_uuid')
    .references(() => clients.uuid)
    .notNull(),
  contactUuid: uuid('contact_uuid')
    .references(() => contacts.uuid)
    .notNull(),
  estimateProductUuid: uuid('estimate_product_uuid')
    .references(() => products.uuid)
    .notNull(),
  estimateProductTypeUuid: uuid('estimate_product_type_uuid')
    .references(() => productsType.uuid)
    .notNull(),
  estimateSalesRepUuid: uuid('estimate_sales_rep_uuid')
    .references(() => salesReps.uuid)
    .notNull(),
  estimateNumber: serial('estimate_number').notNull(),
  estimateTitle: varchar('estimate_title', { length: 256 }).notNull(),
  estimateDescription: varchar('estimate_description', {
    length: 256,
  }).notNull(),

  estimateStatus: estimateStatusEnum('estimate_status').default('Not Started'),
  estimateStage: estimateStageEnum('estimate_stage').default('Empty'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  updatedBy: varchar('updated_by', { length: 256 }).notNull(),
})

export const salesReps = createTable('sales_reps', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  salesRepName: varchar('sales_rep_name', { length: 256 }).notNull().unique(),
  salesRepMobile: varchar('sales_rep_mobile', { length: 15 })
    .notNull()
    .unique(),
  salesRepEmail: varchar('sales_rep_email', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
})

export const salesRepsRelations = relations(salesReps, ({ many }) => ({
  estimates: many(estimates),
}))

export const variations = createTable('variations', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  estimateUuid: uuid('estimate_uuid')
    .references(() => estimates.uuid, { onDelete: 'cascade' })
    .notNull(),
  variationTitle: varchar('variation_title', { length: 256 }),
  variationNotes: text('variation_notes'),
  // quotationComments: text('quotation_comments'),
  clientEnquiry: text('client_enquiry'),

  //sizes
  closeSizeName: varchar('close_size_name', { length: 256 }),
  closeSizeLength: numeric('close_size_length', { precision: 7, scale: 2 }),
  closeSizeWidth: numeric('close_size_width', { precision: 7, scale: 2 }),
  openSizeName: varchar('open_size_name', { length: 256 }),
  openSizeLength: numeric('open_size_length', { precision: 7, scale: 2 }),
  openSizeWidth: numeric('open_size_width', { precision: 7, scale: 2 }),

  //cover
  coverFrontColors: smallint('cover_front_colors'),
  coverBackColors: smallint('cover_back_colors'),
  coverPages: smallint('cover_pages'),
  coverGrammage: smallint('cover_grammage'),
  coverLamination: varchar('cover_lamination', { length: 256 }),
  coverPaperType: varchar('cover_paper_type', { length: 256 }),

  //text
  textColors: smallint('text_colors'),
  textPages: smallint('text_pages'),
  textGrammage: smallint('text_grammage'),
  textLamination: varchar('text_lamination', { length: 256 }),
  textPaperType: varchar('text_paper_type', { length: 256 }),

  //secondary text
  secondaryTextColors: smallint('secondary_text_colors'),
  secondaryTextPages: smallint('secondary_text_pages'),
  secondaryTextGrammage: smallint('secondary_text_grammage'),
  secondaryTextLamination: varchar('secondary_text_lamination', {
    length: 256,
  }),
  secondaryTextPaperType: varchar('secondary_text_paper_type', { length: 256 }),

  //fabrication
  binding: varchar('binding', { length: 256 }),
  coverUV: varchar('cover_uv', { length: 256 }),
  coverFoiling: varchar('cover_foiling', { length: 256 }),
  coverEmbossing: varchar('cover_embossing', { length: 256 }),
  textUV: varchar('text_uv', { length: 256 }),
  vdp: varchar('vdp', { length: 256 }),
  gummingType: varchar('gumming_type', { length: 256 }),
  textCoating: varchar('text_coating', { length: 256 }),
  coverCoating: varchar('cover_coating', { length: 256 }),
  coverDieCutting: varchar('cover_die_cutting', { length: 256 }),
  textDieCutting: varchar('text_die_cutting', { length: 256 }),
  makingProcess: varchar('making_process', { length: 256 }),

  //Board Specifications
  boardType: varchar('board_type', { length: 256 }),
  boardThickness: numeric('board_thickness', { precision: 7, scale: 2 }),

  //packaging
  packagingType: varchar('packaging_type', { length: 256 }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  updatedBy: varchar('updated_by', { length: 256 }).notNull(),
})

export const variationQtysRates = createTable('variation_qtys_rates', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  variationUuid: uuid('variation_uuid')
    .references(() => variations.uuid, { onDelete: 'cascade' })
    .notNull(),
  quantity: numeric('quantity').notNull(),
  rate: numeric('rate').notNull(),
})

export const variationQtysRatesRelations = relations(
  variationQtysRates,
  ({ one }) => ({
    variation: one(variations, {
      fields: [variationQtysRates.variationUuid],
      references: [variations.uuid],
    }),
  }),
)

export const variationsRelations = relations(variations, ({ one, many }) => ({
  estimate: one(estimates, {
    fields: [variations.estimateUuid],
    references: [estimates.uuid],
  }),
  variationQtysRates: many(variationQtysRates),
  variationCalculations: many(variationCalculation),
}))

export const paperMaster = createTable('paper_master', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  paperName: varchar('paper_name', { length: 256 }).notNull().unique(),
  paperLength: numeric('paper_length', { precision: 7, scale: 2 }).notNull(),
  paperWidth: numeric('paper_width', { precision: 7, scale: 2 }).notNull(),
  paperGrammage: numeric('paper_grammage', {
    precision: 7,
    scale: 2,
  }).notNull(),
  paperFinish: varchar('paper_finish', { length: 256 }).notNull(),
  paperType: varchar('paper_type', { length: 256 }).notNull(),
  paperMill: varchar('paper_mill', { length: 256 }).notNull(),
  paperQuality: varchar('paper_quality', { length: 256 }).notNull(),
  paperDefaultRate: numeric('paper_default_rate', {
    precision: 7,
    scale: 2,
  }).notNull(),
  paperRemarks: text('paper_remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
})

export const variationCalculation = createTable('variation_calculation', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  variationUuid: uuid('variation_uuid')
    .references(() => variations.uuid, { onDelete: 'cascade' })
    .notNull(),
  coverSpine: numeric('cover_spine', { precision: 7, scale: 2 }),
  coverBleed: numeric('cover_bleed', { precision: 7, scale: 2 }),
  coverGrippers: numeric('cover_grippers', { precision: 7, scale: 2 }),
  coverPaper: varchar('cover_paper', { length: 256 }),
  coverPaperRate: numeric('cover_paper_rate', { precision: 7, scale: 2 }),
  coverWastageFactor: numeric('cover_wastage_factor', {
    precision: 7,
    scale: 3,
  }),
  coverPlateRateFactor: numeric('cover_plate_rate_factor', {
    precision: 7,
    scale: 3,
  }),
  coverPrintingRateFactor: numeric('cover_printing_rate_factor', {
    precision: 7,
    scale: 3,
  }),
  coverPlateRate: numeric('cover_plate_rate', { precision: 7, scale: 2 }),
  coverPlateSize: varchar('cover_plate_size', { length: 256 }),

  coverPrintingRate: numeric('cover_printing_rate', { precision: 7, scale: 2 }),
  coverPrintingType: varchar('cover_printing_type', { length: 256 }),
  coverWorkingLength: numeric('cover_working_length', {
    precision: 7,
    scale: 2,
  }),
  coverWorkingWidth: numeric('cover_working_width', { precision: 7, scale: 2 }),
  coverWidthFlap: numeric('cover_width_flap', { precision: 7, scale: 2 }),
  coverLengthFlap: numeric('cover_length_flap', { precision: 7, scale: 2 }),
  textGutters: numeric('text_gutters', { precision: 7, scale: 2 }),
  textBleed: numeric('text_bleed', { precision: 7, scale: 2 }),
  textGrippers: numeric('text_grippers', { precision: 7, scale: 2 }),
  textPaper: varchar('text_paper', { length: 256 }),
  textPaperRate: numeric('text_paper_rate', { precision: 7, scale: 2 }),

  textWastageFactor: numeric('text_wastage_factor', {
    precision: 7,
    scale: 3,
  }),
  textPlateRateFactor: numeric('text_plate_rate_factor', {
    precision: 7,
    scale: 3,
  }),
  textPrintingRateFactor: numeric('text_printing_rate_factor', {
    precision: 7,
    scale: 3,
  }),
  textPlateRate: numeric('text_plate_rate', { precision: 7, scale: 2 }),
  textPlateSize: varchar('text_plate_size', { length: 256 }),
  textPrintingRate: numeric('text_printing_rate', { precision: 7, scale: 2 }),
  textWorkingLength: numeric('text_working_length', {
    precision: 7,
    scale: 2,
  }),
  textWorkingWidth: numeric('text_working_width', { precision: 7, scale: 2 }),
  secondaryTextPaper: varchar('secondary_text_paper', { length: 256 }),
  secondaryTextPaperRate: numeric('secondary_text_paper_rate', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextWastageFactor: numeric('secondary_text_wastage_factor', {
    precision: 7,
    scale: 3,
  }),
  secondaryTextPlateRateFactor: numeric('secondary_text_plate_rate_factor', {
    precision: 7,
    scale: 3,
  }),
  secondaryTextPrintingRateFactor: numeric(
    'secondary_text_printing_rate_factor',
    { precision: 7, scale: 3 },
  ),
  secondaryTextPlateRate: numeric('secondary_text_plate_rate', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextPlateSize: varchar('secondary_text_plate_size', { length: 256 }),
  secondaryTextPrintingRate: numeric('secondary_text_printing_rate', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextWorkingLength: numeric('secondary_text_working_length', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextWorkingWidth: numeric('secondary_text_working_width', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextGutters: numeric('secondary_text_gutters', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextBleed: numeric('secondary_text_bleed', {
    precision: 7,
    scale: 2,
  }),
  secondaryTextGrippers: numeric('secondary_text_grippers', {
    precision: 7,
    scale: 2,
  }),
  boardRate: numeric('board_rate', { precision: 7, scale: 2 }),
  profitPercentage: numeric('profit_percentage', { precision: 7, scale: 4 }),
  discountPercentage: numeric('discount_percentage', {
    precision: 7,
    scale: 4,
  }),
  addedHardcoverLength: numeric('added_hardcover_length', {
    precision: 7,
    scale: 2,
  }),
  addedHardcoverWidth: numeric('added_hardcover_width', {
    precision: 7,
    scale: 2,
  }),
})

export const estimatesRelations = relations(estimates, ({ one, many }) => ({
  client: one(clients, {
    fields: [estimates.clientUuid],
    references: [clients.uuid],
  }),
  contact: one(contacts, {
    fields: [estimates.contactUuid],
    references: [contacts.uuid],
  }),
  productType: one(productsType, {
    fields: [estimates.estimateProductTypeUuid],
    references: [productsType.uuid],
  }),
  product: one(products, {
    fields: [estimates.estimateProductUuid],
    references: [products.uuid],
  }),
  salesRep: one(salesReps, {
    fields: [estimates.estimateSalesRepUuid],
    references: [salesReps.uuid],
  }),
  variations: many(variations),
}))

export const variationCalculationRelations = relations(
  variationCalculation,
  ({ one }) => ({
    variation: one(variations, {
      fields: [variationCalculation.variationUuid],
      references: [variations.uuid],
    }),
  }),
)
