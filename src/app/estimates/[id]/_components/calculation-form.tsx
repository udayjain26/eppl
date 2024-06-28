import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getVariationCalculation } from '@/server/calculations/queries'
import {
  CalculationFormState,
  VariationCalculationData,
} from '@/server/calculations/types'
import saveCalculationData from '@/server/calculations/actions'
import { CalculationFormSchema } from '@/schemas/calculation-form-schema'
import { productFieldMap } from '../../../settings/product-constants'
import CoverCalculation, {
  CoverCostData,
} from './calculation-components/cover-calculation'
import TextCalculation, {
  TextCostData,
} from './calculation-components/text-calculation'
import { VariationData } from '@/server/variations/types'
import { useFormState, useFormStatus } from 'react-dom'
import { PaperData } from '@/server/paper/types'
import FabricationCalculation, {
  FabricationCostData,
} from './calculation-components/fabrication-calculation'
import { useFormState as useFormStateReactHookForm } from 'react-hook-form'
import { toast } from 'sonner'
import TotalCalculation, {
  TotalCostDetails,
} from './calculation-components/total-calculation'
import PackagingCalculation from './calculation-components/packaging-calculation'
import { Sheet } from 'lucide-react'
import SheetPrintingCalculation from './calculation-components/sheet-printing-calculation'

function SaveButton(props: { isDirty: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending || !props.isDirty}
    >
      {pending ? 'Saving Calculation...' : 'Save Calculation'}
    </Button>
  )
}

const calculationComponentMap: { [key: string]: React.ComponentType<any> } = {
  totalCalculation: TotalCalculation,
  coverCalculation: CoverCalculation,
  textCalculation: TextCalculation,
  sheetPrintingCalculation: SheetPrintingCalculation,
  fabricationCalculation: FabricationCalculation,
  packagingCalculation: PackagingCalculation,
}

export default function CalculationFields(props: {
  product: string
  variationData: VariationData
  paperData: PaperData[]
}) {
  const [variationCalculationData, setVariationCalculationData] =
    useState<VariationCalculationData | null>(null)

  const form = useForm<z.infer<typeof CalculationFormSchema>>({
    resolver: zodResolver(CalculationFormSchema),
  })

  const { dirtyFields } = form.formState

  const [coverCostDataTable, setCoverCostDataTable] = useState<
    CoverCostData | undefined
  >(undefined)
  const [textCostDataTable, setTextCostDataTable] = useState<
    TextCostData | undefined
  >(undefined)
  const [fabricationCostDataTable, setFabricationCostDataTable] = useState<
    FabricationCostData | undefined
  >(undefined)
  const [packagingCostDataTable, setPackagingCostDataTable] = useState<
    FabricationCostData | undefined
  >(undefined)

  const [totalCostDataTable, setTotalCostDataTable] = useState<
    TotalCostDetails | undefined
  >(undefined)

  const { isDirty } = useFormStateReactHookForm(form)



  const initialState: CalculationFormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }

  const [state, formAction] = useFormState(
    async (previousState: CalculationFormState, formData: FormData) => {
      // Pass totalCostDataTable along with formData to saveCalculationData
      return await saveCalculationData(
        previousState,
        formData,
        totalCostDataTable,
      )
    },
    initialState,
  )
  useEffect(() => {
    const fetchCalculationData = async () => {
      const data = await getVariationCalculation(props.variationData.uuid)
      setVariationCalculationData(data)
      form.reset({
        coverSpine: data?.coverSpine ? data.coverSpine.toString() : '0',
        coverBleed: data?.coverBleed ? data.coverBleed.toString() : '3',
        coverGrippers: data?.coverGrippers
          ? data.coverGrippers.toString()
          : '10',
        coverPaper: data?.coverPaper,
        coverPaperRate: data?.coverPaperRate
          ? data.coverPaperRate.toString()
          : '0',
        coverWastageFactor: data?.coverWastageFactor
          ? data.coverWastageFactor.toString()
          : '1',
        coverPlateRate: data?.coverPlateRate
          ? data.coverPlateRate.toString()
          : '300',
        coverPrintingRate: data?.coverPrintingRate
          ? data.coverPrintingRate.toString()
          : '150',
        coverPrintingType: data?.coverPrintingType
          ? data.coverPrintingType
          : 'frontBack',
        coverPlateRateFactor: data?.coverPlateRateFactor
          ? data.coverPlateRateFactor.toString()
          : '1',
        coverPrintingRateFactor: data?.coverPrintingRateFactor
          ? data.coverPrintingRateFactor.toString()
          : '1',
        coverWorkingLength: data?.coverWorkingLength
          ? data.coverWorkingLength.toString()
          : '0',
        coverWorkingWidth: data?.coverWorkingWidth
          ? data.coverWorkingWidth.toString()
          : '0',
        coverPlateSize: data?.coverPlateSize
          ? data.coverPlateSize.toString()
          : 'Small',
        textGutters: data?.textGutters ? data.textGutters.toString() : '0',
        textBleed: data?.textBleed ? data.textBleed.toString() : '3',
        textGrippers: data?.textGrippers ? data.textGrippers.toString() : '10',
        textPaper: data?.textPaper,
        textPaperRate: data?.textPaperRate
          ? data.textPaperRate.toString()
          : '0',
        textWastageFactor: data?.textWastageFactor
          ? data.textWastageFactor.toString()
          : '1',
        textPlateRateFactor: data?.textPlateRateFactor
          ? data.textPlateRateFactor.toString()
          : '1',
        textPrintingRateFactor: data?.textPrintingRateFactor
          ? data.textPrintingRateFactor.toString()
          : '1',
        textPlateRate: data?.textPlateRate
          ? data.textPlateRate.toString()
          : '500',
        textPrintingRate: data?.textPrintingRate
          ? data.textPrintingRate.toString()
          : '150',
        textWorkingLength: data?.textWorkingLength
          ? data.textWorkingLength.toString()
          : '0',
        textWorkingWidth: data?.textWorkingWidth
          ? data.textWorkingWidth.toString()
          : '0',
        textPlateSize: data?.textPlateSize
          ? data.textPlateSize.toString()
          : 'Large',
        profitPercentage: data?.profitPercentage
          ? data.profitPercentage.toString()
          : '25',
        discountPercentage: data?.discountPercentage
          ? data.discountPercentage.toString()
          : '0',
      })
    }
    fetchCalculationData()
  }, [])
  useEffect(() => {
    if (
      state.actionSuccess === true &&
      state.message === 'Calculation Saved Successfully!'
    ) {
      toast.success('Calculation Saved Successfully!')
      form.reset(form.getValues())
    } else {
      if (state.message) {
        toast.error(state.message)
      }
    }
  }, [state])

  const fields = productFieldMap[props.product]['calculationComponents'] || []

  if (!variationCalculationData) {
    return <div>Loading...</div>
  }
  const formActionWithTotalCostData = formAction.bind(totalCostDataTable)

  return (
    <Form {...form}>
      <form action={formActionWithTotalCostData}>
        <input
          readOnly
          hidden
          value={props.variationData.uuid}
          {...form.register('variationUuid')}
        ></input>
        <div className="flex flex-col">
          <div className="flex w-full flex-row justify-between py-4">
            <h1 className="text-3xl">{props.variationData.variationTitle}</h1>

            <div className="w-52">
              <SaveButton isDirty={isDirty} />
            </div>
          </div>
          <div>
            <Separator />

            {fields.map((component) => {
              const FieldComponent = calculationComponentMap[component]
              return FieldComponent ? (
                <FieldComponent
                  key={component}
                  variationData={props.variationData}
                  form={form}
                  paperData={props.paperData}
                  coverCostDataTable={coverCostDataTable}
                  setCoverCostDataTable={setCoverCostDataTable}
                  textCostDataTable={textCostDataTable}
                  setTextCostDataTable={setTextCostDataTable}
                  fabricationCostDataTable={fabricationCostDataTable}
                  setFabricationCostDataTable={setFabricationCostDataTable}
                  packagingCostDataTable={packagingCostDataTable}
                  setPackagingCostDataTable={setPackagingCostDataTable}
                  totalCostDataTable={totalCostDataTable}
                  setTotalCostDataTable={setTotalCostDataTable}
                />
              ) : null
            })}
          </div>
        </div>
      </form>
    </Form>
  )
}
