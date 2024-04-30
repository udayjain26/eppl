import {
  uuid,
  pgTableCreator,
  varchar,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `eppl_${name}`)

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

export const clientCreationStatus = pgEnum('client_creation_status', [
  'New',
  'Old',
])

export const clients = createTable(
  'clients',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    clientName: varchar('client_name', { length: 256 }).notNull(),
    clientNickName: varchar('client_nick_name', { length: 256 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
    gstin: varchar('gstin', { length: 15 }),
    clientCreationStatus: clientCreationStatus(
      'client_creation_status',
    ).notNull(),
  },
  (table) => {
    return {
      nameIdx: index('name_idx').on(table.clientName).asc(),
    }
  },
)
