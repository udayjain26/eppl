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
import { Separator } from '@/components/ui/separator'

export type FabricationCostDataDict = {
  jobQuantity: number
  fabricationSheets?: number
  foldingCost?: number
  gatheringCost?: number
  perfectBindingCost?: number
  sewnAndPerfect?: number
  sidePinAndPerfect?: number
  centrePin?: number
  coverUV?: number
  vdp?: number
  gumming?: number
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
    jobQuantity: 'Job Qty',
    fabricationSheets: 'Sheets',
    foldingCost: 'Folding',
    gatheringCost: 'Gathering',
    perfectBindingCost: 'Perfect',
    sewnAndPerfect: 'Sewn & Perfect',
    sidePinAndPerfect: 'Side Pin Perfect',
    centrePin: 'Centre Pin',
    coverUV: 'Cover UV',
    vdp: 'VDP',
    gumming: 'Gumming',
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

  console.log('variationData', variationData.coverUV)

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Fabrication Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Fabrication Forms</span>
                <span>{fabricationCostDataTable?.fabricationForms}</span>
              </li>
              {variationData?.binding !== 'None' &&
                variationData?.binding !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Binding</span>
                    <span>{variationData?.binding}</span>
                  </li>
                )}
              {variationData?.coverUV !== 'None' &&
                variationData?.coverUV !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Cover UV</span>
                    <span>{variationData?.coverUV}</span>
                  </li>
                )}
              {variationData?.vdp !== 'None' && variationData?.vdp !== null && (
                <li className="flex items-center justify-between border-b-2">
                  <span className="text-muted-foreground">VDP</span>
                  <span>{variationData?.vdp}</span>
                </li>
              )}
              {variationData?.gummingType !== 'None' &&
                variationData?.gummingType !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Gumming Type</span>
                    <span>{variationData?.gummingType}</span>
                  </li>
                )}
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
        </div>
      </div>
      <Separator />
    </>
  )
}
