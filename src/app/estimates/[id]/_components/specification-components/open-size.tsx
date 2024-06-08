import MySep from '@/app/_components/custom-sep'
import { commonSizes } from '@/app/estimates/constants'
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

export default function OpenSize(props: { control: any; form: UseFormReturn }) {
  const [lengthInInches, setLengthInInches] = useState('')
  const [widthInInches, setWidthInInches] = useState('')

  const [open, setOpen] = React.useState(false)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: any,
    setInches: (value: string) => void,
  ) => {
    const value = e.target.value
    const lastChar = value.charAt(value.length - 1)

    if (lastChar === '"') {
      const numericValue = parseFloat(value.slice(0, -1))
      if (!isNaN(numericValue)) {
        const mmValue = (numericValue * 25.4).toFixed(2) // Convert inches to mm
        field.onChange(mmValue)
        setInches(numericValue.toFixed(2))
        props.form.setValue('openSizeName', 'Custom') // Set combobox to "Custom" when custom size is entered
      } else {
        field.onChange(value.slice(0, -1))
        setInches('')
      }
    } else {
      field.onChange(value)
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue)) {
        setInches((numericValue / 25.4).toFixed(2)) // Convert mm to inches
        props.form.setValue('openSizeName', 'Custom') // Set combobox to "Custom" when custom size is entered
      } else {
        setInches('')
      }
    }
  }
  const handleInputSelect = (
    openSize: any,
    field: any,
    setLengthInInches: (value: string) => void,
    setWidthInInches: (value: string) => void,
  ) => {
    const { length, width } = openSize
    props.form.setValue('openSizeLength', length.toString())
    props.form.setValue('openSizeWidth', width.toString())
    field.onChange(openSize.label)
    setLengthInInches((length / 25.4).toFixed(2))
    setWidthInInches((width / 25.4).toFixed(2))
  }

  useEffect(() => {
    const lengthValue = props.form.getValues('openSizeLength')
    const widthValue = props.form.getValues('openSizeWidth')

    if (lengthValue) {
      setLengthInInches((parseFloat(lengthValue) / 25.4).toFixed(2))
    }
    if (widthValue) {
      setWidthInInches((parseFloat(widthValue) / 25.4).toFixed(2))
    }
  }, [props.form])

  return (
    <div className="flex flex-col pt-4">
      <h1>Open Size Details</h1>
      <div className="flex h-20 flex-row gap-x-1">
        <FormField
          control={props.control}
          name="openSizeName"
          render={({ field }) => (
            <FormItem
              className="flex flex-col
           gap-y-1 pt-[6px]"
            >
              <FormLabel>Size Name</FormLabel>

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
                      ? commonSizes.find((size) => size.label === field.value)
                          ?.label
                      : 'Select'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search sizes..."
                      className="h-10"
                    />
                    <CommandEmpty>No size found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {commonSizes.map((size) => (
                          <CommandItem
                            key={size.label}
                            value={size.label}
                            onSelect={() => {
                              props.form.setValue('openSizeName', size.label)
                              handleInputSelect(
                                size,
                                field,
                                setLengthInInches,
                                setWidthInInches,
                              )

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
        <div className="flex flex-col">
          {' '}
          <FormField
            control={props.control}
            name="openSizeLength"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Length(mm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      handleInputChange(e, field, setLengthInInches)
                    }
                  ></Input>
                </FormControl>
                <div className=" pl-2 text-sm text-gray-500">
                  {lengthInInches && `(${lengthInInches} in)`}
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          <FormField
            control={props.control}
            name="openSizeWidth"
            render={({ field }) => (
              <FormItem className="w-20">
                <FormLabel>Width(mm)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      handleInputChange(e, field, setWidthInInches)
                    }
                  ></Input>
                </FormControl>
                <div className="pl-2 text-sm text-gray-500">
                  {widthInInches && `(${widthInInches} in)`}
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
      <MySep />
    </div>
  )
}
