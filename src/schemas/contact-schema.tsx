import { uuid } from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Zod Schema for contact creation form

export const ContactFormSchema = z.object({
  uuid: z.string().uuid(),
  clientUuid: z.string().uuid(),
  contactFirstName: z.string({ message: 'Missing contact first name' }).trim(),
  contactLastName: z.string().trim().nullable(),
  contactEmail: z
    .string()
    .email({ message: 'Incorrectly formatted email' })
    .nullable(),
  contactMobile: z
    .string()
    .regex(new RegExp('^[0-9]{10}$'), {
      message: 'Incorrectly formatted phone number',
    })
    .nullable(),
  contactDesignation: z.string().trim().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().trim().nullable(),
  updatedBy: z.string().trim().nullable(),
})
