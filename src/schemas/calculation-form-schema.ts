import { z } from 'zod'

export const CalculationFormSchema = z.object({
  variationUuid: z.string().uuid(),
  coverSpine: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Spine must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverBleed: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Bleed must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverGrippers: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Grippers must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPaper: z.string().optional(),
  coverPaperRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPlateRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPrintingRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  coverWastageFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Wastage Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  coverPrintingType: z.string(),

  textBleed: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Bleed must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textGrippers: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Grippers must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textGutters: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Gutters must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  textPaper: z.string().optional(),

  textPaperRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textPlateRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textPrintingRate: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Rate must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),

  textWastageFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Wastage Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
})
