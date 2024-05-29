import { z } from 'zod'

export const VariationFormSchema = z.object({
  uuid: z.string().uuid(),
  estimateUuid: z.string().uuid(),
  variationTitle: z.string({ message: 'Variation title is required!' }).trim(),
  variationNotes: z.string().trim().optional(),
  clientEnquiry: z.string().trim().optional(),
  variationQtysRates: z
    .array(
      z.object({
        uuid: z.string().uuid().optional(),
        variationUuid: z.string().uuid(),
        quantity: z.coerce
          .number({ message: 'Quantity must be a number!' })
          .int()
          .nonnegative(),
        rate: z.coerce
          .number({ message: 'Rate must be a number!' })
          .nonnegative(),
      }),
    )
    .optional(),

  //Details for the variation
  sizeLength: z.coerce
    .number()
    .nonnegative({ message: 'Length must be non-negative' })
    .optional(),
  sizeWidth: z.coerce
    .number()
    .nonnegative({ message: 'Width must be non-negative' })
    .optional(),
  sizeName: z.string().optional(),

  // openSizeLength: z.number().nonnegative().optional(),
  // openSizeWidth: z.number().nonnegative().optional(),
  // closeSizeLength: z.number().nonnegative().optional(),
  // closeSizeWidth: z.number().nonnegative().optional(),

  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
