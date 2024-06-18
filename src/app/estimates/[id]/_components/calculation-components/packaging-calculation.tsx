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
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TextCostData } from './text-calculation'
import { CoverCostData } from './cover-calculation'
import { calculatePackagingCost } from '@/server/calculations/packaging/actions'
import { Separator } from '@/components/ui/separator'

export type PackagingCostDataDict = {
  jobQuantity: number
  totalKgs: number
  totalCost: number
  costPerPiece: number
}

export type PackagingCostData =
  | {
      packagingCostDataDict: PackagingCostDataDict[]
    }
  | undefined

export default function PackagingCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  setPackagingCostDataTable: React.Dispatch<
    React.SetStateAction<PackagingCostData | undefined>
  >
  packagingCostDataTable: PackagingCostData | undefined
  textCostDataTable: TextCostData
  coverCostDataTable: CoverCostData
}) {
  const {
    variationData,
    packagingCostDataTable,
    textCostDataTable,
    coverCostDataTable,
    setPackagingCostDataTable,
  } = props

  useEffect(() => {
    const calculatePackaging = async () => {
      const fetchPackagingCostDataTable = await calculatePackagingCost(
        variationData,
        textCostDataTable,
        coverCostDataTable,
      )
      setPackagingCostDataTable(fetchPackagingCostDataTable)
    }
    calculatePackaging()
  }, [
    textCostDataTable,
    coverCostDataTable,
    variationData,
    setPackagingCostDataTable,
  ])

  const headers: {
    key: keyof PackagingCostDataDict
    label: string | undefined
  }[] = []
  const rows: JSX.Element[] = []

  const headerLabels: { [key in keyof PackagingCostDataDict]: string } = {
    jobQuantity: 'Job Qty',
    totalKgs: 'Total Kgs',
    totalCost: 'Total Cost',
    costPerPiece: 'Cost Per Piece',
  }

  if (
    packagingCostDataTable &&
    packagingCostDataTable.packagingCostDataDict.length > 0
  ) {
    // Collect all defined headers
    const firstItem = packagingCostDataTable.packagingCostDataDict[0]
    for (const key in firstItem) {
      if (firstItem[key as keyof PackagingCostDataDict] !== undefined) {
        headers.push({
          key: key as keyof PackagingCostDataDict,
          label: headerLabels[key as keyof PackagingCostDataDict],
        })
      }
    }

    // Collect all rows with defined keys
    rows.push(
      ...packagingCostDataTable.packagingCostDataDict.map((item, index) => {
        const row = headers.map(({ key }) => (
          <TableCell key={key}>{item[key]}</TableCell>
        ))
        return <TableRow key={index}>{row}</TableRow>
      }),
    )
  }

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Packaging Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              {variationData?.packagingType !== 'None' &&
                variationData?.packagingType !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">
                      Packaging Type
                    </span>
                    <span>{variationData?.packagingType}</span>
                  </li>
                )}
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            <Table>
              <TableCaption>Packaging Costs</TableCaption>
              {headers.length > 0 && (
                <>
                  <TableHeader>
                    <TableRow>
                      {headers.map(({ key, label }) => (
                        <TableHead key={key}>{label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>{rows}</TableBody>
                </>
              )}
            </Table>
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}
