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
  making?: number
  centrePin?: number
  coverUV?: number
  textUV?: number
  coverFoiling?: number
  coverEmbossing?: number
  vdp?: number
  coverCoating?: number
  textCoating?: number
  coverDieCutting?: number
  textDieCutting?: number
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
  secondaryTextCostDataTable: TextCostData
  coverCostDataTable: CoverCostData
}) {
  const {
    variationData,
    fabricationCostDataTable,
    textCostDataTable,
    secondaryTextCostDataTable,
    coverCostDataTable,
    setFabricationCostDataTable,
  } = props

  useEffect(() => {
    const calculateFabrication = async () => {
      const fetchFabricationCostDataTable = await calculateFabricationCost(
        variationData,
        textCostDataTable,
        secondaryTextCostDataTable,
        coverCostDataTable,
      )
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
    making: 'Making',
    centrePin: 'Centre Pin',
    coverUV: 'Cover UV',
    textUV: 'Text UV',
    coverCoating: 'Cover Coating',
    textCoating: 'Text Coating',
    coverFoiling: 'Cover Foiling',
    coverEmbossing: 'Cover Embossing',
    coverDieCutting: 'Cover Die Cutting',
    textDieCutting: 'Text Die Cutting',
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
              {variationData?.textUV !== 'None' &&
                variationData?.textUV !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Text UV</span>
                    <span>{variationData?.textUV}</span>
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
              {variationData?.coverCoating !== 'None' &&
                variationData?.coverCoating !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Cover Coating</span>
                    <span>{variationData?.coverCoating}</span>
                  </li>
                )}
              {variationData?.textCoating !== 'None' &&
                variationData?.textCoating !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Text Coating</span>
                    <span>{variationData?.textCoating}</span>
                  </li>
                )}
              {variationData?.coverFoiling !== 'None' &&
                variationData?.coverFoiling !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Cover Foiling</span>
                    <span>{variationData?.coverFoiling}</span>
                  </li>
                )}
              {variationData?.coverEmbossing !== 'None' &&
                variationData?.coverEmbossing !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">
                      Cover Embossing
                    </span>
                    <span>{variationData?.coverEmbossing}</span>
                  </li>
                )}
              {variationData?.coverDieCutting !== 'None' &&
                variationData?.coverDieCutting !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">
                      Cover Die Cutting
                    </span>
                    <span>{variationData?.coverDieCutting}</span>
                  </li>
                )}
              {variationData?.textDieCutting !== 'None' &&
                variationData?.textDieCutting !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">
                      Text Die Cutting
                    </span>
                    <span>{variationData?.textDieCutting}</span>
                  </li>
                )}
              {variationData?.makingProcess !== 'None' &&
                variationData?.makingProcess !== null && (
                  <li className="flex items-center justify-between border-b-2">
                    <span className="text-muted-foreground">Making</span>
                    <span>{variationData?.makingProcess}</span>
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
