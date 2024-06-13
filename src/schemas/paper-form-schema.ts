import { z } from 'zod'

export const PaperFormSchema = z.object({
  paperName: z.string({ message: 'Paper name is required!' }).trim(),
  paperLength: z.coerce
    .number({ message: 'Length must be a number' })
    .nonnegative({ message: 'Length must be non-negative' })
    .min(100, { message: 'Length must be greater than 100 mm' }),
  paperWidth: z.coerce
    .number({ message: 'Width must be a number' })
    .nonnegative({ message: 'Width must be non-negative' })
    .min(100, { message: 'Width must be greater than 100 mm' }),
  paperGrammage: z.coerce
    .number({ message: 'Grammage must be a number' })
    .nonnegative({ message: 'Grammage must be non-negative' }),
  paperType: z.string({ message: 'Paper finish is required!' }),
  paperFinish: z.string({ message: 'Paper finish is required!' }).trim(),
  paperMill: z.string({ message: 'Paper finish is required!' }),
  paperQuality: z.string({ message: 'Paper quality is required!' }),
  paperDefaultRate: z.coerce
    .number({ message: 'Rate must be a number' })
    .nonnegative({ message: 'Rate must be non-negative' }),
  paperRemarks: z.string({ message: 'Remarks is required!' }).trim().optional(),
})
