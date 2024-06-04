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
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { PaperData } from '@/server/paper/types'
import { getPaperData } from '@/server/paper/queries'
import {
  PaperPiece,
  calculateTotalCoverSheets as calculateTotalCoverSheets,
} from '@/server/calculations/cover/actions'
import { Input } from '@/components/ui/input'

type CoverSheetsData = {
  coverPiecesPerSheet: number
  coverUpsPerSheet: number
  piecesPositions: PaperPiece[]
  percentageSheetUsed: number
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
      )
      setCoverSheetsData(coverSheetsData)
    }

    calculateCoverSheets()
  }, [
    effectiveCoverLength,
    effectiveCoverWidth,
    grippers,
    selectedPaper,
    props.variationData,
  ])

  return (
    <>
      <div className="flex flex-row justify-between gap-x-8 p-4">
        <div className="flex w-full flex-col gap-y-2">
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
        <div className="flex w-full flex-col gap-y-2">
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
            {/* <FormField
              control={props.form.control}
              name="coverWastage"
              render={({ field }) => (
                <FormItem className=" grow">
                  <FormLabel>Wastage%</FormLabel>
                  <FormControl>
                    <Input {...field}></Input>
                  </FormControl>
                </FormItem>
              )}
            /> */}
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
                className="flex w-full 
           flex-col gap-y-1"
              >
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
        </div>
        <div className="flex w-full flex-col">
          <h1 className="underline">Calculated</h1>

          <div className="text-sm">
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
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Paper Area Used</span>
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
        <div className="flex w-full flex-col"></div>
      </div>
      <Separator />
    </>
  )
}
