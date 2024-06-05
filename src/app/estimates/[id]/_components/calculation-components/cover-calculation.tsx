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
  calculateTotalCoverSheets as calculateTotalCoverSheets,
} from '@/server/calculations/cover/actions'
import { Input } from '@/components/ui/input'
import { useFieldArray } from 'react-hook-form'
import FormError from '@/app/_components/form-error'
import { Slider } from '@/components/ui/slider'

type CoverSheetsData = {
  coverPiecesPerSheet: number
  coverUpsPerSheet: number
  piecesPositions: PaperPiece[]
  percentageSheetUsed: number
  requiredSheetsDataTable: {
    quantity: number
    requiredSheets: number
    totalWastage: number
    totalRequiredSheets: number
    totalWeight: number
    totalCost: number
    costPerPiece: number
  }[]
}

export default function CoverCalculation(props: {
  variationData: VariationData
  form: any
}) {
  const [paperData, setPaperData] = useState<PaperData[]>([])
  const [openPaper, setOpenPaper] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null)
  const [coverSheetsData, setCoverSheetsData] = useState<
    CoverSheetsData | undefined
  >(undefined)

  const { register } = props.form

  const effectiveCoverLength = props.variationData.openSizeLength
    ? props.variationData.openSizeLength +
      Number(props.form.watch('coverBleed')) * 2
    : 0
  const effectiveCoverWidth = props.variationData.openSizeWidth
    ? props.variationData.openSizeWidth +
      Number(props.form.watch('coverSpine')) +
      Number(props.form.watch('coverBleed')) * 2
    : 0
  const grippers = Number(props.form.watch('coverGrippers'))
  const wastageFactor = Number(props.form.watch('coverWastageFactor'))
  console.log(wastageFactor)
  const paperRatePerkg = Number(props.form.watch('coverPaperRate'))

  useEffect(() => {
    const fetchData = async () => {
      const result = await getPaperData()
      console.log(result)
      setPaperData(result)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const calculateCoverSheets = async () => {
      const coverSheetsData = await calculateTotalCoverSheets(
        props.variationData,
        selectedPaper ? selectedPaper : undefined,
        props.variationData.coverPages,
        effectiveCoverLength,
        effectiveCoverWidth,
        grippers,
        paperRatePerkg,
        wastageFactor,
      )
      setCoverSheetsData(coverSheetsData)
    }
    calculateCoverSheets()
  }, [
    effectiveCoverLength,
    effectiveCoverWidth,
    grippers,
    selectedPaper,
    paperRatePerkg,
    wastageFactor,
    props.variationData,
  ])

  useEffect(() => {
    const initialPaperName = props.form.getValues('coverPaper')
    const initialSelectedPaper = paperData.find(
      (paper) => paper.paperName === initialPaperName,
    )
    if (initialSelectedPaper) {
      setSelectedPaper(initialSelectedPaper)
    }
  }, [paperData, props.form])

  return (
    <>
      <div className="flex flex-row gap-x-8 p-4">
        <div className="flex flex-col gap-y-2">
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
                <span className="text-muted-foreground">Grammage</span>
                <span>{props.variationData?.coverGrammage} gsm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Paper Type</span>
                <span>{props.variationData?.coverPaperType}</span>
              </li>

              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Colors</span>
                <span>{props.variationData?.coverColors} </span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Pages/Ups</span>
                <span>{props.variationData?.coverPages} </span>
              </li>
              <li className="flex items-center justify-between text-right">
                <span className="text-muted-foreground">Lamination</span>
                <span>{props.variationData?.coverLamination} </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex  flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            <FormField
              control={props.form.control}
              name="coverSpine"
              render={({ field }) => (
                <FormItem className=" grow">
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
                <FormItem className=" grow">
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
                <FormItem className=" grow">
                  <FormLabel>Grippers(mm)</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-x-2">
            <ul className="flex flex-row gap-x-2 text-sm">
              <li>Effective Cover Length: {effectiveCoverLength}(mm)</li>
              <li>Effective Cover Width: {effectiveCoverWidth}(mm) </li>
            </ul>
          </div>

          <h1 className="">Cover Paper Planning</h1>
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
                  <PopoverTrigger className="w-full" asChild>
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
                        ? paperData.find(
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
                          {paperData.map((paper) => (
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
                <FormLabel>Cover Wastage Factor: {value}</FormLabel>
                <FormControl>
                  <Slider
                    className="mt-2"
                    min={0.01}
                    max={2}
                    step={0.01}
                    defaultValue={[value]}
                    onValueCommit={onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex  flex-col ">
          <h1 className="underline">Calculated</h1>

          <div className="flex flex-col gap-y-7 text-sm">
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">
                  Cover Pieces/Sheet
                </span>
                <span>{coverSheetsData?.coverPiecesPerSheet}</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Cover Ups/Sheet</span>
                <span>{coverSheetsData?.coverUpsPerSheet}</span>
              </li>
              <li
                className={cn('flex items-center justify-between border-b-2', {
                  ' text-red-500': coverSheetsData?.percentageSheetUsed! < 90,
                })}
              >
                <span className={cn('text-muted-foreground', {})}>
                  Paper Area Used
                </span>
                <span>
                  {coverSheetsData?.percentageSheetUsed?.toFixed(2)} %
                </span>
              </li>
            </ul>
            <FormField
              control={props.form.control}
              name="coverPaperRate"
              render={({ field }) => (
                <FormItem className=" grow">
                  <FormLabel>Paper Rate/Kg</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row">
        <div className="flex flex-col justify-end gap-y-2">
          <div className="flex h-full w-full flex-col pt-2 ">
            <div className="h-full min-h-48">
              <div className="flex flex-row items-center justify-between px-2 py-2">
                <h1 className="text-center text-base font-bold">
                  Total Sheets and Rate Data Table
                </h1>
              </div>
              <Separator />

              <div className="flex flex-row px-2 py-1">
                <div className="flex w-20  flex-col border-b text-sm ">
                  <p className="  px-2 text-center">Quantity</p>
                </div>

                <div className="flex w-20 flex-col border-b text-sm ">
                  <p className="  px-2 text-center">Calculated Sheets</p>
                </div>

                <div className="flex w-20 flex-col border-b  text-sm">
                  <p className="  px-2 text-center">Wastage Sheets</p>
                </div>

                <div className="flex w-20 flex-col border-b  text-sm ">
                  <p className=" px-2 text-center">Total Sheets</p>
                </div>
                <div className="flex w-20 flex-col border-b text-sm ">
                  <p className="  px-2 text-center">Total Weight</p>
                </div>
                <div className="flex w-20 flex-col border-b text-sm ">
                  <p className="  px-2 text-center">Total Cost</p>
                </div>
                <div className="flex w-20 flex-col border-b text-sm ">
                  <p className="  px-2 text-center">Cost/ Piece</p>
                </div>
              </div>

              <ul className="">
                {coverSheetsData?.requiredSheetsDataTable.map((item, index) => (
                  <li key={item.quantity}>
                    <div className="flex flex-row px-2 py-1">
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        readOnly
                        value={item.quantity}
                        {...register(
                          `coverSheetsDataTable.${index}.quantity`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        readOnly
                        value={item.requiredSheets}
                        {...register(
                          `coverSheetsDataTable.${index}.requiredSheets`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        value={item.totalWastage}
                        {...register(
                          `coverSheetsDataTable.${index}.totalWastage`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        value={item.totalRequiredSheets}
                        {...register(
                          `coverSheetsDataTable.${index}.totalRequiredSheets`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        value={item.totalWeight}
                        {...register(
                          `coverSheetsDataTable.${index}.totalWeight`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        value={item.totalCost}
                        {...register(
                          `coverSheetsDataTable.${index}.totalCost`,
                          {},
                        )}
                      />
                      <Input
                        className="w-20 border-none text-center shadow-none ring-0 focus-visible:ring-0"
                        value={item.costPerPiece}
                        {...register(
                          `coverSheetsDataTable.${index}.costPerPiece`,
                          {},
                        )}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}
