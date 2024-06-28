import TextDieCutting from '@/app/estimates/[id]/_components/specification-components/text-die-cutting'
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

  coverFrontColors: z.preprocess(
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
      .optional(),
  ),
  coverBackColors: z.preprocess(
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
      .optional(),
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
      .optional(),
  ),
  coverGrammage: z.preprocess(
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
      .nonnegative({ message: 'Cover Grammage must be non-negative' })
      .optional(),
  ),
  coverLamination: z.string().optional(),
  // coverBothSideLamination: z.coerce.boolean().optional(),
  coverPaperType: z.string().optional(),

  // coverPaper: z.string().optional(),

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
      .optional(),
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
      .optional(),
  ),
  textGrammage: z.preprocess(
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
      .nonnegative({ message: 'Text Grammage must be non-negative' })
      .optional(),
  ),
  textLamination: z.string().optional(),
  textPaperType: z.string().optional(),

  binding: z.string().optional(),
  // catalogBrochureBinding: z.string().optional(),
  coverUV: z.string().optional(),
  coverFoiling: z.string().optional(),
  coverEmbossing: z.string().optional(),
  textUV: z.string().optional(),

  vdp: z.string().optional(),
  packagingType: z.string().optional(),
  gummingType: z.string().optional(),
  textCoating: z.string().optional(),
  coverCoating: z.string().optional(),
  coverDieCutting: z.string().optional(),
  textDieCutting: z.string().optional(),

  // textPaper: z.string().optional(),

  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
