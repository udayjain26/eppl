'use client'

import MySep from '@/app/_components/custom-sep'
import { commonSizes, laminations } from '@/app/estimates/constants'
import { paperFinishes, paperTypes } from '@/app/settings/constants'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import { cn } from '@/lib/utils'
import { PaperData } from '@/server/paper/types'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { set } from 'date-fns'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { ChangeEvent, useState } from 'react'

export default function Cover(props: {
  control: any
  form: any
  paperData: PaperData[]
}) {
  const [openLamination, setOpenLamination] = React.useState(false)
  const [openPaper, setOpenPaper] = React.useState(false)
  const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null)
  const [openPaperType, setOpenPaperType] = React.useState(false)

  const [openPaperFinish, setOpenPaperFinish] = React.useState(false)

  return (
    <div className="flex  flex-col pt-4">
      <h1>Cover Details</h1>
      <div className="flex flex-row gap-x-1">
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="coverColors"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormLabel> #Colors</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="coverPages"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormLabel>#Pages</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="coverLamination"
            render={({ field }) => (
              <FormItem
                className="flex flex-col 
           gap-y-1 pt-[6px]"
              >
                <FormLabel>Cover Lamination</FormLabel>

                <Popover open={openLamination} onOpenChange={setOpenLamination}>
                  <PopoverTrigger className="" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openLamination}
                      className="w-48 justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? laminations.find((size) => size.label === field.value)
                            ?.label
                        : 'Select lamination...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search laminations..."
                        className="h-10"
                      />
                      <CommandEmpty>No size found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {laminations.map((size) => (
                            <CommandItem
                              key={size.label}
                              value={size.label}
                              onSelect={() => {
                                props.form.setValue(
                                  'coverLamination',
                                  size.label,
                                )

                                setOpenLamination(false)
                              }}
                            >
                              {size.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === size.label
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
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="flex flex-row gap-x-1">
        <FormField
          control={props.control}
          name="coverGrammage"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel>Paper GSM</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={props.control}
          name="coverPaperType"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Cover Paper Type</FormLabel>

              <Popover open={openPaperType} onOpenChange={setOpenPaperType}>
                <PopoverTrigger className="" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPaperType}
                    className="w-48 justify-between"
                  >
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? field.value : ''}
                    />
                    {field.value
                      ? paperTypes.find((type) => type.label === field.value)
                          ?.label
                      : 'Select paper type...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search paper types..."
                      className="h-10"
                    />
                    <CommandEmpty>No paper type found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {paperTypes.map((type) => (
                          <CommandItem
                            key={type.label}
                            value={type.label}
                            onSelect={() => {
                              props.form.setValue('coverPaperType', type.label)

                              setOpenPaperType(false)
                            }}
                          >
                            {type.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value === type.label
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
            </FormItem>
          )}
        />
        {/* <FormField
          control={props.control}
          name="coverPaperFinish"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Cover Paper Finish</FormLabel>

              <Popover open={openPaperFinish} onOpenChange={setOpenPaperFinish}>
                <PopoverTrigger className="" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPaperFinish}
                    className="w-48 justify-between"
                  >
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? field.value : ''}
                    />
                    {field.value
                      ? paperFinishes.find((type) => type.label === field.value)
                          ?.label
                      : 'Select paper finish...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search paper finish..."
                      className="h-10"
                    />
                    <CommandEmpty>No finish found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {paperFinishes.map((type) => (
                          <CommandItem
                            key={type.label}
                            value={type.label}
                            onSelect={() => {
                              props.form.setValue(
                                'coverPaperFinish',
                                type.label,
                              )

                              setOpenPaperType(false)
                            }}
                          >
                            {type.label}
                            <CheckIcon
                              className={cn(
                                'ml-auto h-4 w-4',
                                field.value === type.label
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
            </FormItem>
          )}
        /> */}

        {/* <FormField
          control={props.control}
          name="coverPaper"
          render={({ field }) => (
            <FormItem
              className="flex w-full 
           flex-col gap-y-1 pt-[6px]"
            >
              <FormLabel>Cover Paper</FormLabel>

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
                              props.form.setValue('coverPaper', paper.paperName)
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
                    <p>Weight: {selectedPaper.paperGrammage} gsm</p>
                    <p>Make: {selectedPaper.paperMake}</p>
                    <p>Type: {selectedPaper.paperType}</p>
                    <p>Finish: {selectedPaper.paperFinish}</p>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        /> */}
      </div>
      <MySep />
    </div>
  )
}
