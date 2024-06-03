import { z } from 'zod'

export const CalculationFormSchema = z.object({
  coverPaper: z.string().optional(),
})
