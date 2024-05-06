'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'

import { FormState, createClient } from '@/server/actions'
import { useFormState } from 'react-dom'

import { ClientFormSchema } from '@/schemas/form-schemas'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Check, CheckIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { stateEnum } from '@/server/db/schema'
import { ScrollArea } from '@/components/ui/scroll-area'

const states = Object.entries(stateEnum.enumValues).map(([key, value]) => ({
  label: value,
  value: value,
}))

console.log('STATES:', states)
// // console.log('LANGUAGES', languages)

// const languages = [{ label: 'Delhi', value: 'Delhi' }] as const

export function CreateClientForm() {
  const form = useForm<z.infer<typeof ClientFormSchema>>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      isNewClient: false,
    },
  })

  const initialState: FormState = { message: null, errors: {} }
  const [state, formAction] = useFormState(createClient, initialState)

  return (
    <Form {...form}>
      <form action={formAction} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="clientFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.clientFullName,
                })}
                type="text"
                placeholder="Excel Printers Private Limited"
                name="clientFullName"
              />
              <div>
                {state.errors?.clientFullName &&
                  state.errors.clientFullName.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientNickName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nick Name</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.clientNickName,
                })}
                type="text"
                placeholder="Excel"
                name="clientNickName"
              />
              <div>
                {state.errors?.clientNickName &&
                  state.errors.clientNickName.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isNewClient"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  name="isNewClient"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>New Client</FormLabel>
                <FormDescription>
                  Check this box if we have never billed this client before
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gstin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Identification Number</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.gstin,
                })}
                type="text"
                placeholder="22AAAAA0000A1Z5"
                name="gstin"
              />
              <div>
                {state.errors?.gstin &&
                  state.errors.gstin.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientAddressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address 1</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.clientAddressLine1,
                })}
                type="text"
                placeholder="A-82, Third Floor"
                name="clientAddressLine1"
              />
              <div>
                {state.errors?.clientAddressLine1 &&
                  state.errors.clientAddressLine1.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientAddressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address 2</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.clientAddressLine2,
                })}
                type="text"
                placeholder="Narania Inustrial Area Phase 1"
                name="clientAddressLine2"
              />
              <div>
                {state.errors?.clientAddressLine2 &&
                  state.errors.clientAddressLine2.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientAddressCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.clientAddressCity,
                })}
                type="text"
                placeholder="New Delhi"
                name="clientAddressCity"
              />
              <div>
                {state.errors?.clientAddressCity &&
                  state.errors.clientAddressCity.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientAddressState"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1">
              <FormLabel>State</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        ' justify-between',
                        !field.value && 'text-muted-foreground',
                      )}
                      name="clientAddressState"
                    >
                      <input
                        type="hidden"
                        name="clientAddressState"
                        value={
                          field.value
                            ? states.find(
                                (state) => state.value === field.value,
                              )?.label
                            : ''
                        }
                      />

                      {field.value
                        ? states.find((state) => state.value === field.value)
                            ?.label
                        : 'Select state'}
                      {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search state..."
                      className="h-10"
                      name="clientAddressState"
                    />
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {states &&
                          states.map((state) => (
                            <CommandItem
                              value={state.label}
                              key={state.value}
                              onSelect={() => {
                                form.setValue('clientAddressState', state.value)
                              }}
                            >
                              {' '}
                              {state.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  state.value === field.value
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
          control={form.control}
          name="clientAddressPincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <Input
                className={cn('border', {
                  'border-red-500': state.errors?.gstin,
                })}
                type="text"
                placeholder="110028"
                name="clientAddressPincode"
              />
              <div>
                {state.errors?.clientAddressPincode &&
                  state.errors.clientAddressPincode.map((error: string) => (
                    <p className=" text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </FormItem>
          )}
        />

        <Button className="min-w-full" type="submit">
          Create Client
        </Button>
      </form>
    </Form>
  )
}
