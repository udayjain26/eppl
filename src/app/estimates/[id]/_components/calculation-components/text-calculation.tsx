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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
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
import { CheckIcon } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { text } from 'stream/consumers'
import { useDebounce } from 'use-debounce'

export type TextCostData = {
  pagesPerSheet: number
  textForms: PrintingForms
  totalSets: number
  paperAreaUsed: number
  textWorkingLength: number
  textWorkingWidth: number

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
  textCostDataTable: TextCostData | undefined
  setTextCostDataTable: React.Dispatch<
    React.SetStateAction<TextCostData | undefined>
  >
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

  const textCostDataTable = props.textCostDataTable
  const grippers = Number(props.form.watch('textGrippers'))
  const bleed = Number(props.form.watch('textBleed'))
  const gutters = Number(props.form.watch('textGutters'))

  const effectiveTextLength = props.variationData.openSizeLength
    ? props.variationData.openSizeLength + bleed * 2
    : 0
  const effectiveTextWidth = props.variationData.openSizeWidth
    ? props.variationData.openSizeWidth + bleed * 2 + gutters * 2
    : 0
  const wastageFactor = Number(props.form.watch('textWastageFactor'))
  const plateFactor = Number(props.form.watch('textPlateRateFactor'))
  const printingFactor = Number(props.form.watch('textPrintingFactor'))

  const paperRatePerkg = Number(props.form.watch('textPaperRate'))
  const plateRate = Number(props.form.watch('textPlateRate'))
  const textWorkingLength = Number(props.form.watch('textWorkingLength'))
  const textWorkingWidth = Number(props.form.watch('textWorkingWidth'))
  const watchPaperData = props.form.watch('textPaper')
  const watchPlateSize = props.form.watch('textPlateSize')
  const printingRateFactor = props.form.watch('textPrintingRateFactor')

  const [debouncedWastageFactor] = useDebounce(wastageFactor, 1000)
  const [debouncedPaperRatePerkg] = useDebounce(paperRatePerkg, 1000)
  const [debouncedPlateRate] = useDebounce(plateRate, 1000)
  const [debouncedTextWorkingLength] = useDebounce(textWorkingLength, 1000)
  const [debouncedTextWorkingWidth] = useDebounce(textWorkingWidth, 1000)
  const [debouncedPrintingRateFactor] = useDebounce(printingRateFactor, 1000)
  const [debouncedPlateSize] = useDebounce(watchPlateSize, 1000)

  const effectivePaperLength = textWorkingLength
    ? textWorkingLength - grippers
    : 0
  const effectivePaperWidth = textWorkingWidth ? textWorkingWidth : 0

  const isPlateSizeSmall =
    watchPlateSize === 'Small' &&
    (textWorkingLength > 508 || textWorkingWidth > 762)

  const totalFormsFB = textCostDataTable?.textForms.totalFormsFB ?? 0
  const totalForms2Ups = textCostDataTable?.textForms.totalForms2Ups ?? 0
  const totalForms4Ups = textCostDataTable?.textForms.totalForms4Ups ?? 0
  const totalForms8Ups = textCostDataTable?.textForms.totalForms8Ups ?? 0

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
    }
  }, [watchPaperData])

  useEffect(() => {
    if (watchPlateSize === 'Small') {
      props.form.setValue('textPlateRate', 300 * plateFactor)
    } else if (watchPlateSize === 'Large') {
      props.form.setValue('textPlateRate', 500 * plateFactor)
    }
  }, [watchPlateSize, plateFactor])

  useEffect(() => {
    if (textWorkingLength < 508 && textWorkingWidth < 762) {
      props.form.setValue('textPlateSize', 'Small')
    } else {
      props.form.setValue('textPlateSize', 'Large')
    }
  }, [textWorkingLength, textWorkingWidth])

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
        debouncedPlateSize,
        debouncedPrintingRateFactor,
        'primaryText',
      )
      props.setTextCostDataTable(fetchTextCostData)
    }
    calculateTextCostData()
  }, [
    effectiveTextLength,
    effectiveTextWidth,
    grippers,
    selectedPaper,
    debouncedTextWorkingLength,
    debouncedTextWorkingWidth,
    debouncedPaperRatePerkg,
    debouncedWastageFactor,
    debouncedPlateRate,
    props.variationData,
    props.form,
    debouncedPlateSize,
    debouncedPrintingRateFactor,
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
                <span className="text-muted-foreground">Pages</span>
                <span>{props.variationData?.textPages} </span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Paper Type</span>
                <span>{props.variationData?.textPaperType}</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Grammage</span>
                <span>{props.variationData?.textGrammage} gsm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Colors</span>
                <span>{props.variationData?.textColors}</span>
              </li>

              <li className="flex items-center justify-between border-b-2 text-right">
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
                                  setSelectedPaper(undefined)
                                  props.form.setValue(
                                    'textPaper',
                                    paper.paperName,
                                  )
                                  field.onChange(paper.paperName)
                                  props.form.trigger('textPaper') // Trigger form validation and state update

                                  props.form.setValue(
                                    'textWorkingLength',
                                    paper.paperLength,
                                  )
                                  props.form.setValue(
                                    'textWorkingWidth',
                                    paper.paperWidth,
                                  )

                                  props.form.setValue(
                                    'textPaperRate',
                                    paper.paperDefaultRate,
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
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>
                    Text Wastage Factor {(field.value * 100).toFixed(2)}%
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step={0.001} {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textPlateRateFactor"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>
                    Plate Rate Factor {(field.value * 100).toFixed(2)}%
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step={0.001} {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textPrintingRateFactor"
              render={({ field }) => (
                <FormItem className="w-2/5">
                  <FormLabel>
                    Printing Rate Factor {(field.value * 100).toFixed(2)}%
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step={0.001} {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={props.form.control}
              name="textWorkingLength"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel className=" font-bold">
                    Working Length(mm)
                  </FormLabel>
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
                  <FormLabel className=" font-bold">
                    Working Width(mm)
                  </FormLabel>
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
            <FormField
              control={props.form.control}
              name="textPlateSize"
              render={({ field }) => (
                <FormItem className={cn({ 'text-red-500': isPlateSizeSmall })}>
                  <FormLabel>Text Plate Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    name="textPlateSize"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Large">Large</SelectItem>
                      <SelectItem value="Small">Small</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex w-full max-w-[12rem] flex-col ">
          <h1 className="underline">Calculated</h1>

          <div className="flex  flex-col gap-y-1 text-sm">
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages/Sheet</span>
                <span>{textCostDataTable?.pagesPerSheet}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Text Forms</span>
                <span>
                  {totalFormsFB +
                    totalForms2Ups +
                    totalForms4Ups +
                    totalForms8Ups}
                </span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Total Sets</span>
                <span>{textCostDataTable?.totalSets}</span>
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
                <FormItem className=" grow text-gray-500">
                  <FormLabel>Plate Rate(&#x20B9;)</FormLabel>
                  <FormControl>
                    <Input readOnly {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
            <ol className="flex flex-col gap-x-2">
              <li>Printing Planning: </li>
              <li>
                <span>
                  {textCostDataTable?.textForms.totalFormsFB
                    ? textCostDataTable?.textForms.totalFormsFB + 'x F/B'
                    : ''}
                </span>
              </li>
              <li>
                <span>
                  {textCostDataTable?.textForms.totalForms2Ups
                    ? textCostDataTable?.textForms.totalForms2Ups + 'x W/T 2Ups'
                    : ''}
                </span>
              </li>
              <li>
                <span>
                  {textCostDataTable?.textForms.totalForms4Ups
                    ? textCostDataTable?.textForms.totalForms4Ups + 'x W/T 4Ups'
                    : ''}
                </span>
              </li>
              <li>
                <span>
                  {textCostDataTable?.textForms.totalForms8Ups
                    ? textCostDataTable?.textForms.totalForms8Ups + 'x W/T8Ups'
                    : ''}
                </span>
              </li>
            </ol>
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
      <Separator />
    </>
  )
}
