import { VariationData } from '@/server/variations/types'
import { UseFormReturn } from 'react-hook-form'

export type FabricationCostData = {
  fabricationCostDataDict: {
    jobQuantity: number
    calculatedSheets: number
    foldingCost?: number
    gatheringCost?: number
    perfectBindingCost?: number
    stitchingCost?: number
    sidePinCost?: number
    totalCost: number
    costPerPiece: number
  }[]
}

export default function FabricationCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
}) {
  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Fabrication Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              {props.variationData?.paperbackBookBinding && (
                <li className="flex items-center justify-between border-b-2">
                  <span className="text-muted-foreground">
                    Paperback Book Binding
                  </span>
                  <span>{props.variationData?.paperbackBookBinding}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2"></div>

          <div className="flex flex-row gap-x-2"></div>
        </div>
      </div>
    </>
  )
}
