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
import { ChangeEvent, use, useEffect, useState } from 'react'
import { PaperData } from '@/server/paper/types'
import { getPaperData } from '@/server/paper/queries'
import { calculateCoverCost as calculateCoverCost } from '@/server/calculations/cover/actions'
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
import { PrintingForms } from '@/server/calculations/text/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { calculateBoardCost } from '@/server/calculations/board/actions'

export type BoardCostData = {
  hardCoverPiecesPerSheet: number
  hardCoverBoardSize: string
  hardCoverBoardAreaUsed: number

  spinePiecesPerSheet: number
  spineBoardAreaUsed: number
  spineBoardSize: string

  //   paperAreaUsed: number
  //   coverForms: PrintingForms
  //   totalSets: number
  //   coverSheetLength: number
  //   coverSheetWidth: number
  //   coverCostDataDict: {
  //     jobQuantity: number
  //     calculatedSheets: number
  //     wastageSheets: number
  //     totalSheets: number
  //     paperWeight: number
  //     paperCost: number
  //     plateCost: number
  //     printingCost: number
  //     laminationCost: number
  //     totalCost: number
  //     costPerCover: number
  //   }[]
}

export const boardProductMap: { [key: string]: string[] } = {
  'Coffee Table Books': ['hardcover'],
  'Hardbound Books': ['hardcover'],
  'Hardbound Diaries': ['hardcover'],
}

const mmToInches = (mm: number) => (mm / 25.4).toFixed(2)

export default function BoardCalculation(props: {
  variationData: VariationData
  paperData: PaperData[]
  form: UseFormReturn
  boardCostDataTable: BoardCostData | undefined
  setBoardCostDataTable: React.Dispatch<
    React.SetStateAction<BoardCostData | undefined>
  >
  product: string
}) {
  const boardCostDataTable = props.boardCostDataTable
  const setBoardCostDataTable = props.setBoardCostDataTable
  const boardPiecesComponents = boardProductMap[props.product]

  const bookCloseLength = Number(props.variationData?.closeSizeLength)
  const bookCloseWidth = Number(props.variationData?.closeSizeWidth)
  const addedHardcoverLength = Number(props.form.watch('addedHardcoverLength'))
  const addedHardcoverWidth = Number(props.form.watch('addedHardcoverWidth'))
  const bookSpineWidth = Number(props.form.watch('coverSpine'))

  const [debouncedAddedHardcoverLength] = useDebounce(addedHardcoverLength, 500)
  const [debouncedAddedHardcoverWidth] = useDebounce(addedHardcoverWidth, 500)

  useEffect(() => {
    const calculateBoardCostData = async () => {
      const fetchBoardCostData = await calculateBoardCost()
      props.setBoardCostDataTable(fetchBoardCostData)
    }
    calculateBoardCostData()
  }, [debouncedAddedHardcoverLength, debouncedAddedHardcoverWidth])

  return (
    <>
      <div className="flex flex-col gap-x-8 p-4 sm:flex-row">
        <div className="flex w-full max-w-[12rem] flex-col gap-y-2">
          <h1 className="underline">Board Specifications</h1>
          <div className="text-sm">
            <ul className="flex flex-col gap-y-2">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Board Thickness</span>
                <span>{props.variationData?.boardThickness} mm</span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Board Type</span>
                <span>{props.variationData?.boardType}</span>
              </li>
              <FormField
                control={props.form.control}
                name="boardRate"
                render={({ field }) => (
                  <FormItem className=" grow">
                    <FormLabel>Board Rate(&#x20B9;)/Kg</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-2">
          <div className="flex flex-row gap-x-2">
            {boardPiecesComponents.includes('hardcover') && (
              <>
                <FormField
                  control={props.form.control}
                  name="addedHardcoverLength"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormLabel>Added Hardcover Length(mm)</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                      <span className=" pl-2 text-sm ">
                        {!isNaN(Number(mmToInches(Number(field.value))))
                          ? mmToInches(Number(field.value))
                          : 0}
                        in
                      </span>
                    </FormItem>
                  )}
                />
                <FormField
                  control={props.form.control}
                  name="addedHardcoverWidth"
                  render={({ field }) => (
                    <FormItem className=" ">
                      <FormLabel>Added Hardcover Width(mm)</FormLabel>
                      <FormControl>
                        <Input {...field}></Input>
                      </FormControl>
                      <span className=" pl-2 text-sm ">
                        {!isNaN(Number(mmToInches(Number(field.value))))
                          ? mmToInches(Number(field.value))
                          : 0}
                        in
                      </span>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="flex flex-row gap-x-2"></div>
        </div>
        <div className="flex w-full max-w-[20rem] flex-col ">
          <h1 className="underline">Calculated</h1>

          <div className="flex  flex-col gap-y-1 text-sm">
            <ul className="flex flex-col gap-y-1">
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">
                  Hard Cover Dimensions:
                </span>
                <span>
                  {Number(
                    (bookCloseLength + addedHardcoverLength) / 25.4,
                  ).toFixed(2)}
                  {'in'} x{' '}
                  {Number(
                    (bookCloseWidth + addedHardcoverWidth) / 25.4,
                  ).toFixed(2)}
                  {'in'}
                </span>
              </li>
              <li className="flex items-center justify-between border-b-2">
                <span className="text-muted-foreground">Spine Dimensions</span>
                <span>
                  {Number(
                    (bookCloseLength + addedHardcoverLength) / 25.4,
                  ).toFixed(2)}
                  {'in'} x {Number(bookSpineWidth / 25.4).toFixed(2)}
                  {'in'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />
    </>
  )
}
