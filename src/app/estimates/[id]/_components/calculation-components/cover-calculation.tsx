'use client'

import { VariationData } from '@/server/variations/types'
import { Separator } from '@/components/ui/separator'
import { FormField, FormItem, FormLabel } from '@/components/ui/form'
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

export default function CoverCalculation(props: {
  variationData: VariationData
  form: any
}) {
  const [paperData, setPaperData] = useState<PaperData[]>([])
  const [openPaper, setOpenPaper] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getPaperData()
      setPaperData(result)
    }
    fetchData()
  }, [])

  console.log('paperData', paperData)
  return (
    <>
      <div className="flex flex-row gap-x-2">
        <div className="flex flex-col gap-y-2">
          <h1 className="underline">Cover Specifications</h1>
          <div className="text-sm">
            <ul>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Length</span>
                <span>{props.variationData?.closeSizeLength} mm</span>
              </li>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Width</span>
                <span>{props.variationData?.closeSizeWidth} mm</span>
              </li>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Grammage</span>
                <span>{props.variationData?.coverGrammage} gsm</span>
              </li>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Paper Type</span>
                <span>{props.variationData?.coverPaperType}</span>
              </li>

              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Colors</span>
                <span>{props.variationData?.coverColors} </span>
              </li>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Pages</span>
                <span>{props.variationData?.coverPages} </span>
              </li>
              <li className="flex items-center justify-between border">
                <span className="text-muted-foreground">Lamination</span>
                <span>{props.variationData?.coverLamination} </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex w-1/2 flex-col gap-y-2">
          <h1 className="underline">Cover Planning</h1>

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
      </div>
      <Separator />
    </>
  )
}
