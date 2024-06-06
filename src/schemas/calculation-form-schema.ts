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

  // coverSheetsDataTable: z
  //   .array(
  //     z.object({
  //       uuid: z.string().uuid().optional(),
  //       variationCalculationUuid: z.string().uuid(),
  //       quantity: z.coerce
  //         .number({ message: 'Quantity must be a number!' })
  //         .int({ message: 'Quantity must be an integer!' })
  //         .nonnegative({ message: 'Quantity cannot be negative!' })
  //         .min(1, { message: 'Quantity must be at least 1!' }),
  //       requiredSheets: z.coerce
  //         .number({ message: 'Required Sheets must be a number!' })
  //         .nonnegative(),
  //       wastageSheets: z.coerce
  //         .number({ message: 'Wastage Sheets must be a number!' })
  //         .nonnegative(),
  //       totalRequiredSheets: z.coerce
  //         .number({ message: 'Total Required Sheets must be a number!' })
  //         .nonnegative(),
  //       totalWeight: z.coerce
  //         .number({ message: 'Total Weight must be a number!' })
  //         .nonnegative(),
  //       totalCost: z.coerce
  //         .number({ message: 'Total Cost must be a number!' })
  //         .nonnegative(),
  //       costPerPiece: z.coerce
  //         .number({ message: 'Cost/Piece must be a number!' })
  //         .nonnegative(),
  //     }),
  //   )
  //   .optional(),
})
