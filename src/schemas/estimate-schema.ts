import { z } from 'zod'

export const EstimateFormSchema = z.object({
  uuid: z.string().uuid(),
  clientUuid: z.string().uuid(),
  contactUuid: z.string().uuid(),
  estimateNumber: z.number(),
  estimateTitle: z.string().trim(),
  estimateDescription: z.string().trim(),
  estimateDueDate: z.date(),
  estimateQuatity: z.number(),
  estimateRate: z.number(),
  estimateTotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().trim().nullable(),
  updatedBy: z.string().trim().nullable(),
})
