'use client'

import MySep from '@/app/_components/custom-sep'
import { laminations } from '@/app/settings/constants'
import { paperTypes } from '@/app/settings/paper-constants'
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
import { UseFormReturn } from 'react-hook-form'

export default function Text(props: {
  control: any
  form: UseFormReturn
  paperData: PaperData[]
}) {
  const [openLamination, setOpenLamination] = React.useState(false)
  const [openPaperType, setOpenPaperType] = React.useState(false)

  // const [openPaper, setOpenPaper] = React.useState(false)
  // const [selectedPaper, setSelectedPaper] = useState<PaperData | null>(null)

  return (
    <div className="flex  flex-col pt-4">
      <h1>Text Details</h1>
      <div className="flex flex-row gap-x-1">
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="textColors"
            render={({ field }) => (
              <FormItem className="w-16">
                <FormLabel>#Colors</FormLabel>
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
            name="textPages"
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
            name="textLamination"
            render={({ field }) => (
              <FormItem
                className="flex flex-col 
           gap-y-1 pt-[6px]"
              >
                <FormLabel>Text Lamination</FormLabel>

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
                                  'textLamination',
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
          name="textGrammage"
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
          name="textPaperType"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Text Paper Type</FormLabel>

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
                              props.form.setValue('textPaperType', type.label)

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
      </div>
      <MySep />
    </div>
  )
}
