import { dieCuttingTypes, makingProcesses } from '@/app/settings/constants'
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

export default function Making(props: { control: any; form: UseFormReturn }) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={props.control}
      name="makingProcess"
      render={({ field }) => (
        <FormItem
          className="flex flex-col
           gap-y-1 pt-[6px]"
        >
          <FormLabel>Making</FormLabel>

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
                  ? makingProcesses.find((size) => size.label === field.value)
                      ?.label
                  : 'Select'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput
                  placeholder="Search Die Cutting..."
                  className="h-10"
                />
                <CommandEmpty>No making found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {makingProcesses.map((size) => (
                      <CommandItem
                        key={size.label}
                        value={size.label}
                        onSelect={() => {
                          props.form.setValue('makingProcess', size.label)
                          field.onChange(size.label)
                          props.form.trigger('makingProcess') // Trigger form validation and state update

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
