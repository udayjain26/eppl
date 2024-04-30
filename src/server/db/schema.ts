import { create } from 'domain'
import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  pgTableCreator,
  varchar,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `eppl_${name}`)

export const clients = createTable(
  'clients',
  {
    uuid: uuid('uuid').defaultRandom().primaryKey(),
    clientName: varchar('company_name', { length: 256 }).notNull(),
    createdAt: timestamp('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      nameIdx: index('name_idx').on(table.clientName).asc(),
    }
  },
)
