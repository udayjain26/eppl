import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculateFabricationCost } from '@/server/calculations/fabrication/actions'
import { VariationData } from '@/server/variations/types'
import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { TextCostData } from './text-calculation'
import { CoverCostData } from './cover-calculation'

export type FabricationCostDataDict = {
  jobQuantity: number
  fabricationSheets?: number
  foldingCost?: number
  gatheringCost?: number
  perfectBindingCost?: number
  sewnAndPerfect?: number
  sidePinAndPerfect?: number
  totalCost: number
  costPerPiece: number
}

export type FabricationCostData =
  | {
      fabricationForms: number
      fabricationCostDataDict: FabricationCostDataDict[]
    }
  | undefined

export default function FabricationCalculation(props: {
  variationData: VariationData
  form: UseFormReturn
  setFabricationCostDataTable: React.Dispatch<
    React.SetStateAction<FabricationCostData | undefined>
  >
  fabricationCostDataTable: FabricationCostData | undefined
  textCostDataTable: TextCostData
  coverCostDataTable: CoverCostData
}) {
  const {
    variationData,
    fabricationCostDataTable,
    textCostDataTable,
    coverCostDataTable,
    setFabricationCostDataTable,
  } = props

  useEffect(() => {
    const calculateFabrication = async () => {
      const fetchFabricationCostDataTable = await calculateFabricationCost(
        variationData,
        textCostDataTable,
        coverCostDataTable,
      )
      console.log('fetchFabricationCosts', fetchFabricationCostDataTable)
      setFabricationCostDataTable(fetchFabricationCostDataTable)
    }
    calculateFabrication()
  }, [
    textCostDataTable,
    coverCostDataTable,
    variationData,
    setFabricationCostDataTable,
  ])

  const headers: {
    key: keyof FabricationCostDataDict
    label: string | undefined
  }[] = []
  const rows: JSX.Element[] = []

  const headerLabels: { [key in keyof FabricationCostDataDict]: string } = {
    jobQuantity: 'Job Quantity',
    fabricationSheets: 'Fabrication Sheets',
    foldingCost: 'Folding',
    gatheringCost: 'Gathering',
    perfectBindingCost: 'Perfect Binding',
    sewnAndPerfect: 'Sewn and Perfect',
    sidePinAndPerfect: 'Side Pin and Perfect',
    totalCost: 'Total Cost',
    costPerPiece: 'Cost Per Piece',
  }

  if (
    fabricationCostDataTable &&
    fabricationCostDataTable.fabricationCostDataDict.length > 0
  ) {
    // Collect all defined headers
    const firstItem = fabricationCostDataTable.fabricationCostDataDict[0]
    for (const key in firstItem) {
      if (firstItem[key as keyof FabricationCostDataDict] !== undefined) {
        headers.push({
          key: key as keyof FabricationCostDataDict,
          label: headerLabels[key as keyof FabricationCostDataDict],
        })
      }
    }

    // Collect all rows with defined keys
    rows.push(
      ...fabricationCostDataTable.fabricationCostDataDict.map((item, index) => {
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
          <h1 className="underline">Fabrication Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              {variationData?.paperbackBookBinding && (
                <li className="flex items-center justify-between border-b-2">
                  <span className="text-muted-foreground">
                    Paperback Book Binding
                  </span>
                  <span>{variationData?.paperbackBookBinding}</span>
                </li>
              )}
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Fabrication Forms</span>
                <span>{fabricationCostDataTable?.fabricationForms}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            <Table>
              <TableCaption>Fabrication Costs</TableCaption>
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
          <div className="flex flex-row gap-x-2"></div>
        </div>
      </div>
    </>
  )
}
