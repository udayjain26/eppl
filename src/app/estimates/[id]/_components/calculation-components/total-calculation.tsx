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
import { FabricationCostData } from './fabrication-calculation'

interface CostDetails {
  jobQuantity: number
  costPerPiece: number
  totalCost: number
  platePaperRatio: number
}

export default function TotalCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  coverCostDataTable: CoverCostData | undefined
  textCostDataTable: TextCostData | undefined
  fabricationCostDataTable: FabricationCostData | undefined
}) {
  const { coverCostDataTable, textCostDataTable, fabricationCostDataTable } =
    props

  // Function to calculate cost details for each item
  const calculateCostDetails = () => {
    const costDetails: CostDetails[] = []

    if (textCostDataTable && coverCostDataTable && fabricationCostDataTable) {
      coverCostDataTable.coverCostDataDict.forEach((item, index) => {
        const costPerPiece =
          item.costPerCover +
          textCostDataTable.textCostDataDict[index].costPerText +
          fabricationCostDataTable.fabricationCostDataDict[index].costPerPiece

        const totalCost = costPerPiece * item.jobQuantity
        const platePaperRatio =
          (item.paperCost +
            item.plateCost +
            textCostDataTable.textCostDataDict[index].paperCost +
            textCostDataTable.textCostDataDict[index].plateCost) /
          totalCost

        costDetails.push({
          jobQuantity: item.jobQuantity,
          costPerPiece: parseFloat(costPerPiece.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          platePaperRatio: parseFloat(platePaperRatio.toFixed(2)),
        })
      })
    }

    return costDetails
  }

  // Retrieve calculated cost details
  const costDetails = calculateCostDetails()

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
                <TableHead className=" font-extrabold">Cost/Piece</TableHead>
                <TableHead className=" ">Total Cost</TableHead>
                <TableHead className=" ">PnP Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costDetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.jobQuantity}</TableCell>
                  <TableCell className=" font-extrabold">
                    {item.costPerPiece}
                  </TableCell>
                  <TableCell className=" ">{item.totalCost}</TableCell>
                  <TableCell className=" ">{item.platePaperRatio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
