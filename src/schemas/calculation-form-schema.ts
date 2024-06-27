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

  coverPlateRateFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Plate Rate Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPrintingRateFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Printing Rate Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  coverPlateSize: z.string(),

  coverWorkingLength: z.preprocess(
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
  coverWorkingWidth: z.preprocess(
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
  textPlateRateFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Plate Rate Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textPrintingRateFactor: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Printing Rate Factor must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  textPlateSize: z.string().optional(),

  textWorkingLength: z.preprocess(
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
  textWorkingWidth: z.preprocess(
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
  profitPercentage: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Profit must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
  discountPercentage: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const parsed = parseFloat(val)
        return isNaN(parsed) ? undefined : parsed
      }
      return val
    },
    z
      .number()
      .nonnegative({ message: 'Discount must be non-negative' })
      .optional()
      .transform((val) => val?.toString() || undefined),
  ),
})
