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
import { useDebounce } from 'use-debounce'
import { useEffect, useState } from 'react'
import { watch } from 'fs'

export type TotalCostDetails = {
  jobQuantity: number
  costPerPiece: number
  totalCost: number
  platePaperRatio: number
  profitPerPiece: number
  totalProfit: number
  sellingPrice: number
  totalPrice: number
}[]

export default function TotalCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  coverCostDataTable: CoverCostData
  textCostDataTable: TextCostData
  secondaryTextCostDataTable: TextCostData
  fabricationCostDataTable: FabricationCostData
  packagingCostDataTable: PackagingCostData
  totalCostDataTable: TotalCostDetails
  setTotalCostDataTable: React.Dispatch<TotalCostDetails>
}) {
  const {
    coverCostDataTable,
    textCostDataTable,
    secondaryTextCostDataTable,
    fabricationCostDataTable,
    packagingCostDataTable,
    totalCostDataTable,
    setTotalCostDataTable,
  } = props

  // Debounce value
  const [debouncedCoverCostDataTable] = useDebounce(coverCostDataTable, 500)
  const [debouncedTextCostDataTable] = useDebounce(textCostDataTable, 500)
  const [debouncedSecondaryTextCostDataTable] = useDebounce(
    secondaryTextCostDataTable,
    500,
  )
  const [debouncedFabricationCostDataTable] = useDebounce(
    fabricationCostDataTable,
    500,
  )
  const [debouncedPackagingCostDataTable] = useDebounce(
    packagingCostDataTable,
    500,
  )
  const [debouncedProfitPercentage] = useDebounce(
    props.form.watch('profitPercentage'),
    500,
  ) // Watch only profitPercentage

  const [debouncedDiscountPercentage] = useDebounce(
    props.form.watch('discountPercentage'),
    500,
  ) // Watch only profitPercentage

  // Function to calculate cost details for each item
  const calculateCostDetails = () => {
    const costDetails: TotalCostDetails = []

    debouncedCoverCostDataTable?.coverCostDataDict.forEach((item, index) => {
      const costPerPiece =
        item.costPerCover +
        (debouncedTextCostDataTable?.textCostDataDict[index]?.costPerText ||
          0) +
        +(
          debouncedSecondaryTextCostDataTable?.textCostDataDict[index]
            ?.costPerText || 0
        ) +
        (debouncedFabricationCostDataTable?.fabricationCostDataDict[index]
          ?.costPerPiece || 0) +
        (debouncedPackagingCostDataTable?.packagingCostDataDict[index]
          ?.costPerPiece || 0)

      const totalCost = costPerPiece * item.jobQuantity

      const profitPercentage = parseFloat(debouncedProfitPercentage) / 100
      const discountPercentage = parseFloat(debouncedDiscountPercentage) / 100
      const profitPerPiece = costPerPiece * profitPercentage
      const discountPerPiece = costPerPiece * discountPercentage
      const totalProfit = profitPerPiece * item.jobQuantity
      const totalDiscount = discountPerPiece * item.jobQuantity
      const sellingPrice = costPerPiece + profitPerPiece - discountPerPiece
      const totalPrice = sellingPrice * item.jobQuantity

      const platePaperRatio =
        (item.paperCost +
          item.plateCost +
          (debouncedTextCostDataTable?.textCostDataDict[index]?.paperCost ||
            0) +
          (debouncedTextCostDataTable?.textCostDataDict[index]?.plateCost ||
            0) +
          (debouncedSecondaryTextCostDataTable?.textCostDataDict[index]
            ?.paperCost || 0) +
          (debouncedSecondaryTextCostDataTable?.textCostDataDict[index]
            ?.plateCost || 0)) /
        (sellingPrice * item.jobQuantity)

      costDetails.push({
        jobQuantity: item.jobQuantity,
        costPerPiece: parseFloat(costPerPiece.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        platePaperRatio: parseFloat(platePaperRatio.toFixed(2)),
        profitPerPiece: parseFloat(profitPerPiece.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        sellingPrice: parseFloat(sellingPrice.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      })
    })

    setTotalCostDataTable(costDetails)
  }

  useEffect(() => {
    calculateCostDetails()
  }, [
    debouncedCoverCostDataTable,
    debouncedTextCostDataTable,
    debouncedFabricationCostDataTable,
    debouncedPackagingCostDataTable,
    debouncedProfitPercentage,
    debouncedDiscountPercentage,
  ])

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
          <FormField
            control={props.form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Discount %</FormLabel>
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
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {totalCostDataTable?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.jobQuantity}</TableCell>
                  <TableCell>{item.platePaperRatio}</TableCell>
                  <TableCell>{item.costPerPiece}</TableCell>
                  <TableCell>{item.totalCost}</TableCell>
                  <TableCell>{item.profitPerPiece}</TableCell>
                  <TableCell>{item.totalProfit}</TableCell>
                  <TableCell>{item.sellingPrice}</TableCell>
                  <TableCell>{item.totalPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
