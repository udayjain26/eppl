import { text } from 'stream/consumers'
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
          .int({ message: 'Quantity must be an integer!' })
          .nonnegative({ message: 'Quantity cannot be negative!' })
          .min(1, { message: 'Quantity must be at least 1!' }),
        rate: z.coerce
          .number({ message: 'Rate must be a number!' })
          .nonnegative(),
      }),
    )
    .optional(),

  //Details for the variation
  sizeName: z.string().optional(),
  sizeLength: z.coerce
    .number()
    .nonnegative({ message: 'Length must be non-negative' })
    .optional()
    .transform((val) => val?.toString() || undefined),
  sizeWidth: z.coerce
    .number()
    .nonnegative({ message: 'Width must be non-negative' })
    .optional()
    .transform((val) => val?.toString() || undefined),

  closeSizeName: z.string().optional(),
  closeSizeLength: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Length must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  closeSizeWidth: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Width must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  openSizeName: z.string().optional(),
  openSizeLength: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Length must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  openSizeWidth: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Width must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  coverColors: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .int()
      .nonnegative({ message: 'Cover Colors must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPages: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .int()
      .nonnegative({ message: 'Cover Pages must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverLamination: z.string().optional(),
  coverPaper: z.string().optional(),

  textColors: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .int()
      .nonnegative({ message: 'Text Colors must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textPages: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseInt(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .int()
      .nonnegative({ message: 'Text Pages must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textLamination: z.string().optional(),
  textPaper: z.string().optional(),

  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
