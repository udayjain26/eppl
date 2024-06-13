import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  PrintingForms,
  calculateTextCost,
} from '@/server/calculations/text/actions'
import { PaperData } from '@/server/paper/types'
import { VariationData } from '@/server/variations/types'
import { set } from 'date-fns'
import { CheckIcon } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { text } from 'stream/consumers'
import { useDebounce } from 'use-debounce'

export type TextCostData = {
  textUpsPerSheet: number
  textForms: PrintingForms
  totalSets: number
  paperAreaUsed: number

  textCostDataDict: {
    jobQuantity: number
    calculatedSheets: number
    wastageSheets: number
    totalSheets: number
    paperWeight: number
    paperCost: number
    plateCost: number
    printingCost: number
    laminationCost: number
    totalCost: number
    costPerText: number
  }[]
}

export default function TextCalculation(props: {
  variationData: VariationData
  paperData: PaperData[]
  form: UseFormReturn
}) {
  const [lengthInInches, setLengthInInches] = useState('')
  const [widthInInches, setWidthInInches] = useState('')
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: any,
    setInches: (value: string) => void,
  ) => {
    const value = e.target.value
    const lastChar = value.charAt(value.length - 1)

    if (lastChar === '"') {
      const numericValue = parseFloat(value.slice(0, -1))
      if (!isNaN(numericValue)) {
        const mmValue = (numericValue * 25.4).toFixed(2) // Convert inches to mm
        field.onChange(mmValue)
        setInches(numericValue.toFixed(2))
      } else {
        field.onChange(value.slice(0, -1))
        setInches('')
      }
    } else {
      field.onChange(value)
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue)) {
        setInches((numericValue / 25.4).toFixed(2)) // Convert mm to inches
      } else {
        setInches('')
      }
    }
  }
  const [openPaper, setOpenPaper] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<PaperData | undefined>(
    undefined,
  )
  const [textCostDataTable, setTextCostDataTable] = useState<
    TextCostData | undefined
  >(undefined)
  const grippers = Number(props.form.watch('textGrippers'))
  const bleed = Number(props.form.watch('textBleed'))
  const gutters = Number(props.form.watch('textGutters'))

  const effectivePaperLength = selectedPaper?.paperLength
    ? selectedPaper.paperLength - grippers
    : 0
  const effectivePaperWidth = selectedPaper?.paperWidth
    ? selectedPaper.paperWidth
    : 0

  const effectiveTextLength = props.variationData.openSizeLength
    ? props.variationData.openSizeLength + bleed * 2
    : 0
  const effectiveTextWidth = props.variationData.openSizeWidth
    ? props.variationData.openSizeWidth + bleed * 2 + gutters * 2
    : 0
  const wastageFactor = Number(props.form.watch('textWastageFactor'))
  const paperRatePerkg = Number(props.form.watch('textPaperRate'))
  const plateRate = Number(props.form.watch('textPlateRate'))
  const printingRate = Number(props.form.watch('textPrintingRate'))
  const textWorkingLength = Number(props.form.watch('textWorkingLength'))
  const textWorkingWidth = Number(props.form.watch('textWorkingWidth'))
  const watchPaperData = props.form.watch('textPaper')

  const [debouncedWastageFactor] = useDebounce(wastageFactor, 2000)
  const [debouncedPaperRatePerkg] = useDebounce(paperRatePerkg, 2000)
  const [debouncedPlateRate] = useDebounce(plateRate, 2000)
  const [debouncedPrintingRate] = useDebounce(printingRate, 2000)
  const [debouncedTextWorkingLength] = useDebounce(textWorkingLength, 2000)
  const [debouncedTextWorkingWidth] = useDebounce(textWorkingWidth, 2000)

  useEffect(() => {
    const lengthValue = props.form.getValues('textWorkingLength')
    const widthValue = props.form.getValues('textWorkingWidth')

    if (lengthValue || lengthValue === 0) {
      setLengthInInches((parseFloat(lengthValue) / 25.4).toFixed(2))
    }
    if (widthValue || widthValue === 0) {
      setWidthInInches((parseFloat(widthValue) / 25.4).toFixed(2))
    }
  }, [textWorkingLength, textWorkingWidth])

  useEffect(() => {
    const initialPaperName = props.form.getValues('textPaper')
    const initialSelectedPaper = props.paperData.find(
      (paper) => paper.paperName === initialPaperName,
    )

    if (initialSelectedPaper) {
      setSelectedPaper(initialSelectedPaper)
      props.form.setValue(
        'textPaperRate',
        initialSelectedPaper.paperDefaultRate,
      )
      props.form.setValue('textWorkingLength', initialSelectedPaper.paperLength)
      props.form.setValue('textWorkingWidth', initialSelectedPaper.paperWidth)
    }
  }, [watchPaperData])

  useEffect(() => {
    const calculateTextCostData = async () => {
      const fetchTextCostData = await calculateTextCost(
        props.variationData,
        selectedPaper,
        effectiveTextLength,
        effectiveTextWidth,
        grippers,
        debouncedTextWorkingLength,
        debouncedTextWorkingWidth,
        debouncedPaperRatePerkg,
        debouncedWastageFactor,
        debouncedPlateRate,
        debouncedPrintingRate,
      )
      setTextCostDataTable(fetchTextCostData)
    }
    calculateTextCostData()
  }, [
    effectiveTextLength,
    effectiveTextWidth,
    grippers,
    selectedPaper,
    textWorkingLength,
    textWorkingWidth,
    debouncedTextWorkingLength,
    debouncedTextWorkingWidth,
    debouncedPaperRatePerkg,
    debouncedWastageFactor,
    debouncedPlateRate,
    debouncedPrintingRate,
    props.variationData,
    props.form,
  ])

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Text Specifications</h1>
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
                <span className="text-muted-foreground">Grammage</span>
                <span>{props.variationData?.textGrammage} gsm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Paper Type</span>
                <span>{props.variationData?.textPaperType}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Colors</span>
                <span>{props.variationData?.textColors}</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages</span>
                <span>{props.variationData?.textPages} </span>
              </li>
              <li className="flex items-center justify-between text-right">
                <span className="text-muted-foreground">Lamination</span>
                <span>{props.variationData?.textLamination} </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            <FormField
              control={props.form.control}
              name="textGutters"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Gutters(mm)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textBleed"
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
              name="textGrippers"
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
                Effective Open Length: {effectiveTextLength}(mm) /{' '}
                {(effectiveTextLength / 25.4).toFixed(2)}(in)
              </li>
              <li>
                Effective Open Width: {effectiveTextWidth}(mm) /{' '}
                {(effectiveTextWidth / 25.4).toFixed(2)}(in)
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
            name="textPaper"
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
                          {props.paperData
                            .filter(
                              (paper) =>
                                paper.paperGrammage ===
                                  props.variationData.textGrammage &&
                                paper.paperType ===
                                  props.variationData.textPaperType,
                            )
                            .map((paper) => (
                              <CommandItem
                                key={paper.paperName}
                                value={paper.paperName}
                                onSelect={() => {
                                  console.log('triggered again')
                                  setSelectedPaper(undefined)
                                  props.form.setValue(
                                    'textPaper',
                                    paper.paperName,
                                  )
                                  props.form.setValue(
                                    'textWorkingLength',
                                    paper.paperLength,
                                  )
                                  props.form.setValue(
                                    'textWorkingWidth',
                                    paper.paperWidth,
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
                      <p>Make: {selectedPaper.paperMill}</p>
                      <p>Type: {selectedPaper.paperType}</p>
                      <p>Finish: {selectedPaper.paperFinish}</p>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-x-2">
            <FormField
              control={props.form.control}
              name="textWastageFactor"
              render={({ field: { value, onChange } }) => (
                <FormItem className="w-2/5">
                  <FormLabel>
                    Text Wastage Factor: {(value * 100).toFixed(2)}%
                  </FormLabel>
                  <FormControl>
                    <Slider
                      className="mt-2"
                      min={0.01}
                      max={2.0}
                      step={0.01}
                      defaultValue={[value]}
                      onValueChange={onChange}
                      name="textWastageFactor"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textWorkingLength"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Working Length(mm)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        handleInputChange(e, field, setLengthInInches)
                      }
                    ></Input>
                  </FormControl>
                  <div className="pl-2 text-sm text-gray-500">
                    {lengthInInches && `(${lengthInInches} in)`}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textWorkingWidth"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Working Width(mm)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) =>
                        handleInputChange(e, field, setWidthInInches)
                      }
                    ></Input>
                  </FormControl>
                  <div className="pl-2 text-sm text-gray-500">
                    {widthInInches && `(${widthInInches} in)`}
                  </div>
                </FormItem>
              )}
            />
            {/* <FormField
              control={props.form.control}
              name="textWorkingSheetUps"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Calculated Working Sheet Ups</FormLabel>
                  <FormControl>
                    <Input readOnly={true} {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            /> */}
          </div>
        </div>
        <div className="flex w-full max-w-[12rem] flex-col ">
          <h1 className="underline">Calculated</h1>

          <div className="flex  flex-col gap-y-1 text-sm">
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages/Sheet</span>
                <span>{textCostDataTable?.textUpsPerSheet}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Text Forms</span>
                {/* <span>{textCostDataTable?.textForms}</span> */}
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Total Sets</span>
                <span>
                  {/* {textCostDataTable?.totalSets.totalSetsFB! +
                    textCostDataTable?.totalSets.totalSetsWTHalf! +
                    textCostDataTable?.totalSets.totalSetsWTQuarter!} */}
                </span>
              </li>
              <li
                className={cn('flex items-center justify-between border-b-2', {
                  ' text-red-500': textCostDataTable?.paperAreaUsed! < 90,
                })}
              >
                <span className={cn('text-muted-foreground', {})}>
                  Paper Area Used
                </span>
                <span>{textCostDataTable?.paperAreaUsed} %</span>
              </li>
            </ul>
            <FormField
              control={props.form.control}
              name="textPaperRate"
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
              name="textPlateRate"
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
              name="textPrintingRate"
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
        <TableCaption>Text Paper, Plates and Printing Data</TableCaption>
        <TableHeader>
          <TableRow>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {textCostDataTable?.textCostDataDict.map((item, index) => {
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
          })}
        </TableBody>
      </Table>
    </>
  )
}
