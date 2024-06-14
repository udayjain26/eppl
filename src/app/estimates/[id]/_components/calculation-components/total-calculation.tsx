import { VariationData } from '@/server/variations/types'
import { UseFormReturn } from 'react-hook-form'
import { CoverCostData } from './cover-calculation'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TextCostData } from './text-calculation'

export default function TotalCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  coverCostDataTable: CoverCostData | undefined
  textCostDataTable: TextCostData | undefined
}) {
  const coverCostDataTable = props.coverCostDataTable
  const textCostDataTable = props.textCostDataTable
  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Total Cost Details</h1>
          {/* <div className="text-sm">Total Cost</div> */}
          <ul className="flex flex-col gap-y-2"></ul>
        </div>
        <div className="flex  flex-col gap-y-2">
          <Table>
            <TableCaption>Total Costs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Job Quantity</TableHead>
                <TableHead className=" font-extrabold">Cost/Qty</TableHead>
                <TableHead className=" ">Total Cost</TableHead>
                <TableHead className=" ">Plate-Paper Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {textCostDataTable &&
                coverCostDataTable?.coverCostDataDict.map((item, index) => {
                  return (
                    <TableRow key={item.jobQuantity}>
                      <TableCell>{item.jobQuantity}</TableCell>
                      <TableCell className=" font-extrabold">
                        {(
                          item.costPerCover +
                          textCostDataTable?.textCostDataDict[index].costPerText
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="  ">
                        {(
                          (item.costPerCover +
                            textCostDataTable?.textCostDataDict[index]
                              .costPerText) *
                          item.jobQuantity
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="  ">
                        {(
                          (item.paperCost +
                            item.plateCost +
                            textCostDataTable?.textCostDataDict[index]
                              .paperCost +
                            textCostDataTable?.textCostDataDict[index]
                              .plateCost) /
                          ((item.costPerCover +
                            textCostDataTable?.textCostDataDict[index]
                              .costPerText) *
                            item.jobQuantity)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
