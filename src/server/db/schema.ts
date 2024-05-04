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
} from 'drizzle-orm/pg-core'
import { stateEnum } from './enums'

export const createTable = pgTableCreator((name) => `eppl_${name}`)

export const clients = createTable(
  'clients',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    clientName: varchar('client_name', { length: 256 }).notNull(),
    clientNickName: varchar('client_nick_name', { length: 256 }),
    gstin: varchar('gstin', { length: 15 }),
    isNewClient: boolean('is_new_client'),
    clientAddressLine1: varchar('client_address_line1', { length: 256 }),
    clientAddressLine2: varchar('client_address_line2', { length: 256 }),
    clientAddressCity: varchar('client_address_city', { length: 256 }),
    clientAddressState: stateEnum('client_address_state'),
    clientAddressPincode: smallint('client_address_pincode'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => {
    return {
      nameIdx: index('name_idx').on(table.clientName).asc(),
    }
  },
)
