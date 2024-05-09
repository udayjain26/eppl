import { industryEnum, stateEnum } from '@/server/db/schema'
import { z } from 'zod'

export const ClientFormSchema = z.object({
  uuid: z.string().uuid(),
  clientFullName: z.string({ message: 'Missing client full name' }).trim(),
  clientNickName: z.string({ message: 'Missing client nick name' }).trim(),
  gstin: z.coerce
    .string()
    .trim()
    .regex(new RegExp('^\\d{2}[A-Z]{5}\\d{4}[A-Z]\\dZ\\d$'), {
      message: 'Incorrectly formatted GSTIN',
    })
    .length(15, { message: 'The GSTIN must be exactly 15 characters' })
    .nullable(),
  // isNewClient: z.boolean().default(false),
  clientAddressLine1: z.string().trim().nullable(),
  clientAddressLine2: z.string().trim().nullable(),
  clientAddressCity: z.string().trim().nullable(),
  clientAddressState: z.enum(stateEnum.enumValues).nullable(),
  clientAddressPincode: z.coerce
    .string()
    .trim()
    .regex(new RegExp('^[1-9][0-9]{5}$'), {
      message: 'Incorrectly formatted Pincode',
    })
    .length(6)
    .nullable(),
  clientWebsite: z.string().trim().url().nullable(),
  clientIndustry: z.enum(industryEnum.enumValues).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().trim().nullable(),
  updatedBy: z.string().trim().nullable(),
})
