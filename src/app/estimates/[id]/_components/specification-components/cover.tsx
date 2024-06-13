'use client'

import MySep from '@/app/_components/custom-sep'
import { laminations } from '@/app/settings/constants'
import { paperFinishes, paperTypes } from '@/app/settings/paper-constants'
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

export default function Cover(props: {
  control: any
  form: UseFormReturn
  paperData: PaperData[]
}) {
  const [openLamination, setOpenLamination] = React.useState(false)

  const [openPaperType, setOpenPaperType] = React.useState(false)

  return (
    <div className="flex  flex-col pt-4">
      <h1>Cover Details</h1>
      <div className="flex flex-row gap-x-1">
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="coverFrontColors"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Front #Col</FormLabel>
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
            name="coverBackColors"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel> Back #Col</FormLabel>
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
              <FormItem className="w-20">
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
                          {laminations.map((lam) => (
                            <CommandItem
                              key={lam.label}
                              value={lam.label}
                              onSelect={() => {
                                props.form.setValue(
                                  'coverLamination',
                                  lam.label,
                                )
                                field.onChange(lam.label)
                                props.form.trigger('coverLamination')

                                setOpenLamination(false)
                              }}
                            >
                              {lam.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === lam.label
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
                              field.onChange(type.label)
                              props.form.trigger('coverPaperType')

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
