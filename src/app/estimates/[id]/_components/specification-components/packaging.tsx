import MySep from '@/app/_components/custom-sep'
import { commonSizes, packagingTypes } from '@/app/settings/constants'
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
import { CheckIcon, ChevronDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { ChangeEvent, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function Packaging(props: {
  control: any
  form: UseFormReturn
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-col pt-4">
      <h1>Packaging Details</h1>
      <div className="flex h-20 flex-row gap-x-1">
        <FormField
          control={props.control}
          name="packagingType"
          render={({ field }) => (
            <FormItem
              className="flex flex-col
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Packaging</FormLabel>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger className="" asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-32 justify-between "
                  >
                    <input
                      type="hidden"
                      {...field}
                      value={field.value ? field.value : ''}
                    />
                    {field.value
                      ? packagingTypes.find(
                          (size) => size.label === field.value,
                        )?.label
                      : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Packaging Types..."
                      className="h-10"
                    />
                    <CommandEmpty>No size found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {packagingTypes.map((size) => (
                          <CommandItem
                            key={size.label}
                            value={size.label}
                            onSelect={() => {
                              props.form.setValue('packagingType', size.label)
                              field.onChange(size.label)
                              props.form.trigger('packagingType') // Trigger form validation and state update

                              setOpen(false)
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
      <MySep />
    </div>
  )
}
