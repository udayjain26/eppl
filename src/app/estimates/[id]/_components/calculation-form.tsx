import { VariationData } from '@/server/variations/types'
import { productFieldMap } from './constants'
import CoverCalculation from './calculation-components/cover-calculation'
import TextCalculation from './calculation-components/text-calculation'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { PaperData } from '@/server/paper/types'
import { CalculationFormSchema } from '@/schemas/calculation-form-schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

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
  const fields = productFieldMap[props.product]['calculationComponents'] || []
  const form = useForm<z.infer<typeof CalculationFormSchema>>({
    resolver: zodResolver(CalculationFormSchema),
  })

  return (
    <Form {...form}>
      <form>
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
        <div className="w-fit"> {/* <SaveButton /> */}</div>
      </form>
    </Form>
  )
}
