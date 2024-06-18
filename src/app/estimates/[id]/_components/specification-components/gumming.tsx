import MySep from '@/app/_components/custom-sep'
import {
  gummingTypes,
  paperbackBindingTypes,
  uvTypes,
} from '@/app/settings/constants'
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
import { UseFormReturn } from 'react-hook-form'

export default function Gumming(props: { control: any; form: UseFormReturn }) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={props.control}
      name="gummingType"
      render={({ field }) => (
        <FormItem
          className="flex flex-col
           gap-y-1 pt-[6px]"
        >
          <FormLabel>Gumming</FormLabel>

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
                  ? gummingTypes.find((size) => size.label === field.value)
                      ?.label
                  : 'Select'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput
                  placeholder="Search Gumming..."
                  className="h-10"
                />
                <CommandEmpty>No size found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {gummingTypes.map((size) => (
                      <CommandItem
                        key={size.label}
                        value={size.label}
                        onSelect={() => {
                          props.form.setValue('gumminType', size.label)
                          field.onChange(size.label)
                          props.form.trigger('gummingType') // Trigger form validation and state update

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
  )
}
