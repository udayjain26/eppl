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

export const estimates = createTable('estimates', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  clientUuid: uuid('client_uuid')
    .references(() => clients.uuid)
    .notNull(),
  contactUuid: uuid('contact_uuid')
    .references(() => contacts.uuid)
    .notNull(),
  estimateNumber: serial('estimate_number').notNull(),
  estimateTitle: varchar('estimate_title', { length: 256 }).notNull(),
  estimateDescription: varchar('estimate_description', {
    length: 256,
  }).notNull(),
  currentRevision: smallint('current_revision').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 256 }).notNull(),
  updatedBy: varchar('updated_by', { length: 256 }).notNull(),
})

export const estimatesRelations = relations(estimates, ({ one }) => ({
  client: one(clients, {
    fields: [estimates.clientUuid],
    references: [clients.uuid],
  }),
  contact: one(contacts, {
    fields: [estimates.contactUuid],
    references: [contacts.uuid],
  }),
}))
