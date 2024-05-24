import { create } from 'domain'
import { z } from 'zod'

export const VariationFormSchema = z.object({
  uuid: z.string().uuid(),
  estimateUuid: z.string().uuid(),
  variationTitle: z.string({ message: 'Variation title is required!' }).trim(),
  variationNotes: z.string().trim(),
  // variationQtysRates: z.array(
  //   z.object({
  //     uuid: z.string().uuid(),
  //     variationUuid: z.string().uuid(),
  //     quantity: z.number().int(),
  //     rate: z.number().int(),
  //   }),
  // ),
  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
