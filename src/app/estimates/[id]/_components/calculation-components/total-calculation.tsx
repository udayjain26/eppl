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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PackagingCostData } from './packaging-calculation'

interface CostDetails {
  jobQuantity: number
  costPerPiece: number
  totalCost: number
  platePaperRatio: number
  profitPerPiece: number
  totalProfit: number
  sellingPrice: number
}

export default function TotalCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  coverCostDataTable: CoverCostData
  textCostDataTable: TextCostData
  fabricationCostDataTable: FabricationCostData
  packagingCostDataTable: PackagingCostData
}) {
  const {
    coverCostDataTable,
    textCostDataTable,
    fabricationCostDataTable,
    packagingCostDataTable,
  } = props

  // Function to calculate cost details for each item
  const calculateCostDetails = () => {
    const costDetails: CostDetails[] = []

    coverCostDataTable?.coverCostDataDict.forEach((item, index) => {
      const costPerPiece =
        item.costPerCover +
        (textCostDataTable?.textCostDataDict[index].costPerText || 0) +
        (fabricationCostDataTable?.fabricationCostDataDict[index]
          .costPerPiece || 0) +
        (packagingCostDataTable?.packagingCostDataDict[index].costPerPiece || 0)

      const totalCost = costPerPiece * item.jobQuantity

      // Assume we get the profit percentage from the form data
      const profitPercentage =
        parseFloat(props.form.watch('profitPercentage')) / 100
      const profitPerPiece = costPerPiece * profitPercentage
      const totalProfit = profitPerPiece * item.jobQuantity
      const sellingPrice = costPerPiece + profitPerPiece

      const platePaperRatio =
        (item.paperCost +
          item.plateCost +
          (textCostDataTable?.textCostDataDict[index].paperCost || 0) +
          (textCostDataTable?.textCostDataDict[index].plateCost || 0)) /
        (totalCost + totalProfit)

      costDetails.push({
        jobQuantity: item.jobQuantity,
        costPerPiece: parseFloat(costPerPiece.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        platePaperRatio: parseFloat(platePaperRatio.toFixed(2)),
        profitPerPiece: parseFloat(profitPerPiece.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        sellingPrice: parseFloat(sellingPrice.toFixed(2)),
      })
    })

    return costDetails
  }

  // Retrieve calculated cost details
  const costDetails = calculateCostDetails()

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Total Cost Details</h1>
          <FormField
            control={props.form.control}
            name="profitPercentage"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Profit %</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
          <ul className="flex flex-col gap-y-2"></ul>
        </div>
        <div className="flex flex-col gap-y-2">
          <Table>
            <TableCaption>Total Costs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Job Quantity</TableHead>
                <TableHead>PnP Ratio</TableHead>
                <TableHead>Cost/Piece</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Profit/Piece</TableHead>
                <TableHead>Total Profit</TableHead>
                <TableHead>Selling Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costDetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.jobQuantity}</TableCell>
                  <TableCell>{item.platePaperRatio}</TableCell>
                  <TableCell>{item.costPerPiece}</TableCell>
                  <TableCell>{item.totalCost}</TableCell>
                  <TableCell>{item.profitPerPiece}</TableCell>
                  <TableCell>{item.totalProfit}</TableCell>
                  <TableCell>{item.sellingPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
