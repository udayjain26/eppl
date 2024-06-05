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
import { productFieldMap } from './constants'
import CoverCalculation from './calculation-components/cover-calculation'
import TextCalculation from './calculation-components/text-calculation'
import { VariationData } from '@/server/variations/types'
import { useFormState, useFormStatus } from 'react-dom'

function SaveButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Saving Calculation...' : 'Save Calculation'}
    </Button>
  )
}

const calculationComponentMap: { [key: string]: React.ComponentType<any> } = {
  coverCalculation: CoverCalculation,
  textCalculation: TextCalculation,
}

export default function CalculationFields(props: {
  product: string
  variationData: VariationData
}) {
  const [variationCalculationData, setVariationCalculationData] =
    useState<VariationCalculationData | null>(null)

  const form = useForm<z.infer<typeof CalculationFormSchema>>({
    resolver: zodResolver(CalculationFormSchema),
  })

  const initialState: CalculationFormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }
  const [state, formAction] = useFormState(saveCalculationData, initialState)

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
          : '90',
        coverWastageFactor: data?.coverWastageFactor
          ? data.coverWastageFactor.toString()
          : '1',
      })
    }
    fetchCalculationData()
  }, [props.variationData.uuid])

  const fields = productFieldMap[props.product]['calculationComponents'] || []

  return (
    <Form {...form}>
      <form action={formAction}>
        <input
          readOnly
          hidden
          value={props.variationData.uuid}
          {...form.register('variationUuid')}
        ></input>
        <div className="flex flex-col">
          <div>
            <h1>Variation Title: {props.variationData.variationTitle}</h1>
            <Separator />
            {fields.map((component) => {
              const FieldComponent = calculationComponentMap[component]
              return FieldComponent ? (
                <FieldComponent
                  key={component}
                  variationData={props.variationData}
                  form={form}
                />
              ) : null
            })}
          </div>
          <div className="flex w-full flex-row justify-end pt-4">
            <div className="w-52">
              <SaveButton />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
