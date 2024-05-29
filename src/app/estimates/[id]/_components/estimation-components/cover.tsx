'use client'

import MySep from '@/app/_components/custom-sep'
import { commonSizes, laminations } from '@/app/estimates/constants'
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
              <FormItem className="">
                <FormLabel>Cover No. of Colors</FormLabel>
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
              <FormItem className="">
                <FormLabel>Cover No. of Pages</FormLabel>
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
      <div className="flex  w-full flex-row">
        <FormField
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
            </FormItem>
          )}
        />
      </div>
      <MySep />
    </div>
  )
}
