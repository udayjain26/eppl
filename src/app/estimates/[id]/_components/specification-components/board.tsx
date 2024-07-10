'use client'

import MySep from '@/app/_components/custom-sep'
import { laminations } from '@/app/settings/constants'
import {
  boardThicknesses,
  paperFinishes,
  paperTypes,
} from '@/app/settings/paper-constants'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

export default function Board(props: {
  control: any
  form: UseFormReturn
  paperData: PaperData[]
}) {
  const [openPaperType, setOpenPaperType] = React.useState(false)
  const [openBoardThickness, setOpenBoardThickness] = React.useState(false)


  return (
    <div className="flex  flex-col pt-4">
      <h1>Board Details</h1>
      <div className="flex flex-row gap-x-1">
        <FormField
          control={props.control}
          name="boardThickness"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Board Thickness(mm)</FormLabel>

              <Popover
                open={openBoardThickness}
                onOpenChange={setOpenBoardThickness}
              >
                <PopoverTrigger className="" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openBoardThickness}
                    className="w-48 justify-between"
                  >
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? field.value : ''}
                    />
                    {field.value
                      ? boardThicknesses.find(
                          (type) => type.label === field.value,
                        )?.label
                      : 'Select paper type...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search paper types..."
                      className="h-10"
                    />
                    <CommandEmpty>No board thickness found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {boardThicknesses.map((type) => (
                          <CommandItem
                            key={type.label}
                            value={type.label}
                            onSelect={() => {
                              props.form.setValue('boardThickness', type.label)
                              field.onChange(type.label)
                              props.form.trigger('boardThickness')

                              setOpenBoardThickness(false)
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
        <FormField
          control={props.control}
          name="boardType"
          render={({ field }) => (
            <FormItem
              className="flex flex-col 
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Board Type</FormLabel>

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
                        {paperTypes
                          .filter(
                            (paper) =>
                              paper.label === 'G/G Kappa Board' ||
                              paper.label === 'G/W Kappa Board',
                          )
                          .map((type) => (
                            <CommandItem
                              key={type.label}
                              value={type.label}
                              onSelect={() => {
                                props.form.setValue('boardType', type.label)
                                field.onChange(type.label)
                                props.form.trigger('boardType')

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
