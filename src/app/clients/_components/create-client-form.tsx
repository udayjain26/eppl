'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'

import { FormState, createClient } from '@/server/actions'
import { useFormState, useFormStatus } from 'react-dom'

import { ClientFormSchema } from '@/schemas/client-schema'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
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
import { industryEnum, stateEnum } from '@/server/db/schema'
import { toast } from 'sonner'

import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const states = Object.entries(stateEnum.enumValues).map(([key, value]) => ({
  label: value,
  value: value,
}))

const industries = Object.entries(industryEnum.enumValues).map(
  ([key, value]) => ({
    label: value,
    value: value,
  }),
)

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Client...' : 'Create Client'}
    </Button>
  )
}

function CancelButton({ closeDialog }: { closeDialog: () => void }) {
  return (
    <Button
      onClick={closeDialog}
      variant="outline"
      type="reset"
      className="w-full"
    >
      Cancel
    </Button>
  )
}

export function CreateClientForm({ closeDialog }: { closeDialog: () => void }) {
  const initialState: FormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }
  const [state, formAction] = useFormState(createClient, initialState)
  const form = useForm<z.infer<typeof ClientFormSchema>>({
    resolver: zodResolver(ClientFormSchema),
  })

  useEffect(() => {
    if (state.actionSuccess === true) {
      closeDialog()
      toast('Client Created Succesfully!')
    }
  }, [state])

  return (
    <Form {...form}>
      <form
        action={formAction}
        className=" flex h-full w-full flex-col justify-start space-y-2"
      >
        <div className="flex h-fit flex-col  gap-y-2 overflow-scroll scroll-smooth rounded-2xl  p-1 shadow-inner">
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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="additional fields">
              <AccordionTrigger>Optional Fields</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-y-2 p-1">
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
                    <FormItem className="">
                      <FormLabel>Street Address 1</FormLabel>
                      <Input
                        className={cn(' border', {
                          'border-red-500': state.errors?.clientAddressLine1,
                        })}
                        type="text"
                        placeholder="A-82, Third Floor"
                        name="clientAddressLine1"
                      />
                      <div>
                        {state.errors?.clientAddressLine1 &&
                          state.errors.clientAddressLine1.map(
                            (error: string) => (
                              <p className=" text-sm text-red-500" key={error}>
                                {error}
                              </p>
                            ),
                          )}
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
                          state.errors.clientAddressLine2.map(
                            (error: string) => (
                              <p className=" text-sm text-red-500" key={error}>
                                {error}
                              </p>
                            ),
                          )}
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
                          state.errors.clientAddressCity.map(
                            (error: string) => (
                              <p className=" text-sm text-red-500" key={error}>
                                {error}
                              </p>
                            ),
                          )}
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
                                ? states.find(
                                    (state) => state.value === field.value,
                                  )?.label
                                : 'Select state'}
                              <ChevronsUpDown strokeWidth="1" size={24} />{' '}
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
                                        form.setValue(
                                          'clientAddressState',
                                          state.value,
                                        )
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
                          state.errors.clientAddressPincode.map(
                            (error: string) => (
                              <p className=" text-sm text-red-500" key={error}>
                                {error}
                              </p>
                            ),
                          )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <Input
                        className={cn('border', {
                          'border-red-500': state.errors?.clientWebsite,
                        })}
                        type="text"
                        placeholder="www.excelprinters.com"
                        name="clientWebsite"
                      />
                      <div>
                        {state.errors?.clientWebsite &&
                          state.errors.clientWebsite.map((error: string) => (
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
                  name="clientIndustry"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Industry</FormLabel>
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
                              name="clientIndustry"
                            >
                              <input
                                type="hidden"
                                name="clientIndustry"
                                value={
                                  field.value
                                    ? industries.find(
                                        (industry) =>
                                          industry.value === field.value,
                                      )?.label
                                    : ''
                                }
                              />
                              {field.value
                                ? industries.find(
                                    (industry) =>
                                      industry.value === field.value,
                                  )?.label
                                : 'Select industry'}
                              <ChevronsUpDown strokeWidth="1" size={24} />{' '}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search state..."
                              className="h-10"
                              name="clientIndustry"
                            />
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              <CommandList>
                                {industries &&
                                  industries.map((industry) => (
                                    <CommandItem
                                      value={industry.label}
                                      key={industry.value}
                                      onSelect={() => {
                                        form.setValue(
                                          'clientIndustry',
                                          industry.value,
                                        )
                                      }}
                                    >
                                      {' '}
                                      {industry.label}
                                      <CheckIcon
                                        className={cn(
                                          'ml-auto h-4 w-4',
                                          industry.value === field.value
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* <h2 className="text-lg">Optional Fields</h2> */}
        </div>

        <div className="flex h-64 w-full flex-col space-y-2 ">
          {' '}
          <div>
            {
              <p className=" text-sm " key={state.message}>
                {state.message}
              </p>
            }
          </div>
          <SubmitButton />
          <CancelButton closeDialog={closeDialog} />
        </div>
      </form>
    </Form>
  )
}
