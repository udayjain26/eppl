import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  fabricationCostDataTable: FabricationCostData | undefined
  setFabricationCostDataTable: any
}) {
  const fabricationCostDataTable = props.fabricationCostDataTable

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
          <div className="flex flex-row gap-x-2">
            <Table>
              <TableCaption>Fabrication Costs</TableCaption>
              <TableHeader>
                {/* <TableRow>
                  <TableHead>Text Quantity</TableHead>
                  <TableHead>Calculated Sheets</TableHead>
                  <TableHead>Wastage Sheets</TableHead>
                  <TableHead>Total Sheets</TableHead>
                  <TableHead>Paper Weight</TableHead>
                  <TableHead>Paper Cost</TableHead>
                  <TableHead>Plates Cost</TableHead>
                  <TableHead>Printing Cost</TableHead>
                  <TableHead>Lamination Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Cost/Text</TableHead>
                </TableRow> */}
              </TableHeader>
              <TableBody>
                {/* {textCostDataTable?.textCostDataDict.map((item, index) => {
                  return (
                    <TableRow key={item.jobQuantity}>
                      <TableCell>{item.jobQuantity}</TableCell>
                      <TableCell>{item.calculatedSheets}</TableCell>
                      <TableCell>{item.wastageSheets}</TableCell>
                      <TableCell>{item.totalSheets}</TableCell>
                      <TableCell>{item.paperWeight}</TableCell>
                      <TableCell>{item.paperCost}&#x20B9;</TableCell>
                      <TableCell>{item.plateCost}&#x20B9;</TableCell>
                      <TableCell>{item.printingCost}&#x20B9;</TableCell>
                      <TableCell>{item.laminationCost}&#x20B9;</TableCell>
                      <TableCell>{item.totalCost}&#x20B9;</TableCell>
                      <TableCell>{item.costPerText}&#x20B9; </TableCell>
                    </TableRow>
                  )
                })} */}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-row gap-x-2"></div>
        </div>
      </div>
    </>
  )
}
