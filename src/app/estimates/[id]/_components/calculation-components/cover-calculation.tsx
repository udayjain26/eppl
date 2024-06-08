'use client'

import { VariationData } from '@/server/variations/types'
import { Separator } from '@/components/ui/separator'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CheckIcon, Plus, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { PaperData } from '@/server/paper/types'
import { getPaperData } from '@/server/paper/queries'
import {
  PaperPiece,
  calculateTotalCoverCostData as calculateTotalCoverCostData,
} from '@/server/calculations/cover/actions'
import { Input } from '@/components/ui/input'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import FormError from '@/app/_components/form-error'
import { Slider } from '@/components/ui/slider'
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useDebounce } from 'use-debounce'

export type CoverCostData = {
  coverPiecesPerSheet: number
  pagesPerSheet: number
  piecesPositions: PaperPiece[]
  percentageSheetUsed: number
  forms: number
  totalSets: number
  coverCostDataDict: {
    quantity: number
    calculatedSheets: number
    wastageSheets: number
    totalSheets: number
    paperWeight: number
    paperCost: number
    platesCost: number
    printingCost: number
    laminationCost: number
    totalCost: number
    costPerPiece: number
  }[]
}

export default function CoverCalculation(props: {
  variationData: VariationData
  paperData: PaperData[]
  form: UseFormReturn
}) {
  const [openPaper, setOpenPaper] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<PaperData | undefined>(
    undefined,
  )
  const [coverCostDataTable, setCoverCostDataTable] = useState<
    CoverCostData | undefined
  >(undefined)
  const effectiveCoverLength = props.variationData.openSizeLength
    ? props.variationData.openSizeLength +
      Number(props.form.watch('coverBleed')) * 2
    : 0
  const effectiveCoverWidth = props.variationData.openSizeWidth
    ? props.variationData.openSizeWidth +
      Number(props.form.watch('coverSpine')) +
      Number(props.form.watch('coverBleed')) * 2
    : 0
  const coverPrintingType = props.form.watch('coverPrintingType')
  let grippers: number
  grippers = Number(props.form.watch('coverGrippers'))

  if (coverPrintingType === 'workAndTumble') {
    grippers = Number(props.form.watch('coverGrippers')) * 2
  }

  const effectivePaperLength = selectedPaper?.paperLength
    ? selectedPaper.paperLength - grippers
    : 0
  const effectivePaperWidth = selectedPaper?.paperWidth
    ? selectedPaper.paperWidth
    : 0
  const wastageFactor = Number(props.form.watch('coverWastageFactor'))
  const paperRatePerkg = Number(props.form.watch('coverPaperRate'))
  const plateRate = Number(props.form.watch('coverPlateRate'))
  const printingRate = Number(props.form.watch('coverPrintingRate'))

  const [debouncedWastageFactor] = useDebounce(wastageFactor, 1000)
  const [debouncedPaperRatePerkg] = useDebounce(paperRatePerkg, 1000)
  const [debouncedPlateRate] = useDebounce(plateRate, 1000)
  const [debouncedPrintingRate] = useDebounce(printingRate, 1000)

  useEffect(() => {
    const initialPaperName = props.form.getValues('coverPaper')
    const initialSelectedPaper = props.paperData.find(
      (paper) => paper.paperName === initialPaperName,
    )
    if (initialSelectedPaper) {
      setSelectedPaper(initialSelectedPaper)
    }
  }, [props.form.watch('coverPaper')])

  useEffect(() => {
    const calculateCoverSheets = async () => {
      const fetchCoverCostDataTable = await calculateTotalCoverCostData(
        props.variationData,
        selectedPaper,
        props.variationData.coverPages,
        effectiveCoverLength,
        effectiveCoverWidth,
        grippers,
        debouncedPaperRatePerkg,
        debouncedWastageFactor,
        debouncedPlateRate,
        debouncedPrintingRate,
        coverPrintingType,
      )
      setCoverCostDataTable(fetchCoverCostDataTable)
    }
    calculateCoverSheets()
  }, [
    effectiveCoverLength,
    effectiveCoverWidth,
    grippers,
    selectedPaper,
    debouncedPaperRatePerkg,
    debouncedWastageFactor,
    debouncedPlateRate,
    debouncedPrintingRate,
    coverPrintingType,
    props.variationData,
    props.form,
  ])

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Cover Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Close Length</span>
                <span>{props.variationData?.closeSizeLength} mm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Close Width</span>
                <span>{props.variationData?.closeSizeWidth} mm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Open Length</span>
                <span>{props.variationData?.openSizeLength} mm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Open Width</span>
                <span>{props.variationData?.openSizeWidth} mm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Grammage</span>
                <span>{props.variationData?.coverGrammage} gsm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Paper Type</span>
                <span>{props.variationData?.coverPaperType}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Colors</span>
                <span>
                  {props.variationData?.coverFrontColors} +{' '}
                  {props.variationData?.coverBackColors}
                </span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages</span>
                <span>{props.variationData?.coverPages} </span>
              </li>
              <li className="flex items-center justify-between text-right">
                <span className="text-muted-foreground">Lamination</span>
                <span>{props.variationData?.coverLamination} </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            <FormField
              control={props.form.control}
              name="coverSpine"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Spine(mm)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="coverBleed"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Bleed(mm)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="coverGrippers"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Grippers(mm)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-6" variant="outline">
                  View Planning
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:h-[600px] sm:max-w-[1000px]"></DialogContent>
            </Dialog>
          </div>
          <div className="flex w-full flex-row gap-x-2">
            <ul className="flex flex-row gap-x-2 text-xs">
              <li>
                Effective Open Length: {effectiveCoverLength}(mm) /{' '}
                {(effectiveCoverLength / 25.4).toFixed(2)}(in)
              </li>
              <li>
                Effective Open Width: {effectiveCoverWidth}(mm) /{' '}
                {(effectiveCoverWidth / 25.4).toFixed(2)}(in)
              </li>
              <li>
                Effective Paper Length: {effectivePaperLength}(mm) /{' '}
                {(effectivePaperLength / 25.4).toFixed(2)}(in)
              </li>
              <li>
                Effective Paper Width: {effectivePaperWidth}(mm) /{' '}
                {(effectivePaperWidth / 25.4).toFixed(2)}(in)
              </li>
            </ul>
          </div>
          <FormField
            control={props.form.control}
            name="coverPrintingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Printing Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-x-4"
                    {...field}
                  >
                    <FormItem className="flex items-center gap-x-1 ">
                      <FormControl>
                        <RadioGroupItem value="frontBack" />
                      </FormControl>
                      <FormLabel className="font-normal">Front Back</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-x-1 ">
                      <FormControl>
                        <RadioGroupItem value="workAndTurn" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Work and Turn
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-x-1 ">
                      <FormControl>
                        <RadioGroupItem value="workAndTumble" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Work and Tumble
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-x-1 ">
                      <FormControl>
                        <RadioGroupItem
                          disabled={props.variationData.coverBackColors !== 0}
                          value="singleSide"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Single Side</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={props.form.control}
            name="coverPaper"
            render={({ field }) => (
              <FormItem
                className="flex 
           flex-col gap-y-1"
              >
                <FormLabel>Select Paper</FormLabel>
                <Popover open={openPaper} onOpenChange={setOpenPaper}>
                  <PopoverTrigger className="" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPaper}
                      className="w-full justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? props.paperData.find(
                            (paper) => paper.paperName === field.value,
                          )?.paperName
                        : 'Select paper...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search paper..."
                        className="h-10"
                      />
                      <CommandEmpty>No paper found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList className="w-full">
                          {props.paperData.map((paper) => (
                            <CommandItem
                              key={paper.paperName}
                              value={paper.paperName}
                              onSelect={() => {
                                props.form.setValue(
                                  'coverPaper',
                                  paper.paperName,
                                )
                                setSelectedPaper(paper)
                                setOpenPaper(false)
                              }}
                            >
                              {paper.paperName}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === paper.paperName
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div>
                  {selectedPaper && (
                    <div className="flex flex-row gap-x-2 text-xs">
                      <p>L(mm): {selectedPaper.paperLength}</p>
                      <p>W(mm): {selectedPaper.paperWidth}</p>
                      <p>Weight: {selectedPaper.paperGrammage} gsm</p>
                      <p>Make: {selectedPaper.paperMake}</p>
                      <p>Type: {selectedPaper.paperType}</p>
                      <p>Finish: {selectedPaper.paperFinish}</p>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={props.form.control}
            name="coverWastageFactor"
            render={({ field: { value, onChange } }) => (
              <FormItem className="w-2/5">
                <FormLabel>
                  Cover Wastage Factor: {(value * 100).toFixed(2)}%
                </FormLabel>
                <FormControl>
                  <Slider
                    className="mt-2"
                    min={0.01}
                    max={2.0}
                    step={0.01}
                    defaultValue={[value]}
                    onValueChange={onChange}
                    name="coverWastageFactor"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full max-w-[12rem] flex-col ">
          <h1 className="underline">Calculated</h1>

          <div className="flex  flex-col gap-y-1 text-sm">
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">
                  Cover Pieces/Sheet
                </span>
                <span>{coverCostDataTable?.coverPiecesPerSheet}</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages/Sheet</span>
                <span>{coverCostDataTable?.pagesPerSheet}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Cover Forms</span>
                <span>{coverCostDataTable?.forms}</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Total Sets</span>
                <span>{coverCostDataTable?.totalSets}</span>
              </li>
              <li
                className={cn('flex items-center justify-between border-b-2', {
                  ' text-red-500':
                    coverCostDataTable?.percentageSheetUsed! < 90,
                })}
              >
                <span className={cn('text-muted-foreground', {})}>
                  Paper Area Used
                </span>
                <span>
                  {coverCostDataTable?.percentageSheetUsed?.toFixed(2)} %
                </span>
              </li>
            </ul>
            <FormField
              control={props.form.control}
              name="coverPaperRate"
              render={({ field }) => (
                <FormItem className=" grow">
                  <FormLabel>Paper Rate(&#x20B9;)/Kg</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="coverPlateRate"
              render={({ field }) => (
                <FormItem className=" grow">
                  <FormLabel>Plate Rate(&#x20B9;)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="coverPrintingRate"
              render={({ field }) => (
                <FormItem className=" grow">
                  <FormLabel>Printing Rate(&#x20B9;)/Colors</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>Cover Paper, Plates and Printing Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Cover Quantity</TableHead>
            <TableHead>Calculated Sheets</TableHead>
            <TableHead>Wastage Sheets</TableHead>
            <TableHead>Total Sheets</TableHead>
            <TableHead>Paper Weight</TableHead>
            <TableHead>Paper Cost</TableHead>
            <TableHead>Plates Cost</TableHead>
            <TableHead>Printing Cost</TableHead>
            <TableHead>Lamination Cost</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Cost/Cover</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coverCostDataTable?.coverCostDataDict.map((item, index) => {
            return (
              <TableRow key={item.quantity}>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.calculatedSheets}</TableCell>
                <TableCell>{item.wastageSheets}</TableCell>
                <TableCell>{item.totalSheets}</TableCell>
                <TableCell>{item.paperWeight}</TableCell>
                <TableCell>{item.paperCost}&#x20B9;</TableCell>
                <TableCell>{item.platesCost}&#x20B9;</TableCell>
                <TableCell>{item.printingCost}&#x20B9;</TableCell>
                <TableCell>{item.laminationCost}&#x20B9;</TableCell>
                <TableCell>{item.totalCost}&#x20B9;</TableCell>
                <TableCell>{item.costPerPiece}&#x20B9; </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Separator />
    </>
  )
}
