import { estimateStatusEnum } from '@/server/db/schema'
import { z } from 'zod'

export const EstimateFormSchema = z.object({
  uuid: z.string().uuid(),
  clientUuid: z
    .string({ message: 'Please select a client to create the estimate for' })
    .uuid(),
  contactUuid: z
    .string({ message: 'Please select a contact to create the estimate for' })
    .uuid(),
  estimateNumber: z.number(),
  estimateTitle: z.string({ message: 'Give a title to your estimate' }).trim(),
  estimateDescription: z
    .string({ message: 'Give a description to your estimate' })
    .trim(),
  estimateStatus: z.enum(estimateStatusEnum.enumValues),
  currentRevision: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().trim().nullable(),
  updatedBy: z.string().trim().nullable(),
})
