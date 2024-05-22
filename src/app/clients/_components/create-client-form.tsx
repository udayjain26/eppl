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

import {
  ClientFormState,
  createClient,
  updateClient,
} from '@/server/clients/actions'
import { useFormState, useFormStatus } from 'react-dom'

import { ClientFormSchema } from '@/schemas/client-form-schema'
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
import { Client } from '@/schemas/schema-table-types'

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

function UpdateButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Updating Client...' : 'Update Client'}
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

export function CreateClientForm({
  closeDialog,
  clientData,
}: {
  closeDialog: () => void
  clientData?: Client
}) {
  const initialState: ClientFormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }
  const [state, formAction] = clientData
    ? useFormState(updateClient, initialState)
    : useFormState(createClient, initialState)

  // const [accordionValue, setAccordionValue] = useState(
  //   clientData ? 'additional fields' : undefined,
  // )

  // const handleAccordionChange = (value: any) => {
  //   setAccordionValue(value)
  // }

  const form = useForm<z.infer<typeof ClientFormSchema>>({
    resolver: zodResolver(ClientFormSchema),
  })

  useEffect(() => {
    if (state.actionSuccess === true) {
      closeDialog()

      clientData
        ? toast('Client Updated Succesfully!')
        : toast('Client Created Succesfully!')
    }
  }, [state])

  return (
    <Form {...form}>
      <form
        action={formAction}
        className=" flex h-full w-full flex-col justify-start space-y-2"
      >
        {clientData ? (
          <input
            hidden
            value={clientData?.uuid ? clientData.uuid : undefined}
            name="uuid"
          ></input>
        ) : null}

        <div className="flex h-fit flex-col  gap-y-2 overflow-y-scroll scroll-smooth rounded-2xl  p-1 shadow-inner">
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
                  defaultValue={clientData?.clientFullName}
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
                  defaultValue={clientData?.clientNickName}
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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={clientData ? 'additional fields' : undefined}
            // onValueChange={handleAccordionChange}
          >
            <AccordionItem value="additional fields">
              <AccordionTrigger>Optional Fields</AccordionTrigger>
              <AccordionContent
                forceMount={clientData ? true : undefined}
                className="flex flex-col gap-y-2 p-1"
                // hidden={accordionValue !== 'additional fields'}
              >
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
                        defaultValue={
                          clientData?.gstin ? clientData?.gstin : ''
                        }
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
                        defaultValue={
                          clientData?.clientAddressLine1
                            ? clientData?.clientAddressLine1
                            : ''
                        }
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
                        defaultValue={
                          clientData?.clientAddressLine2
                            ? clientData?.clientAddressLine2
                            : ''
                        }
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
                        defaultValue={
                          clientData?.clientAddressCity
                            ? clientData?.clientAddressCity
                            : ''
                        }
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
                  defaultValue={
                    states.find(
                      (state) => state.value === clientData?.clientAddressState,
                    )?.label
                  }
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
                                defaultValue={
                                  clientData?.clientAddressState
                                    ? clientData?.clientAddressState
                                    : ''
                                }
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
                          'border-red-500': state.errors?.clientAddressPincode,
                        })}
                        type="text"
                        placeholder="110028"
                        name="clientAddressPincode"
                        defaultValue={
                          clientData?.clientAddressPincode
                            ? clientData?.clientAddressPincode
                            : ''
                        }
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
                        defaultValue={
                          clientData?.clientWebsite
                            ? clientData?.clientWebsite
                            : ''
                        }
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
                  defaultValue={
                    industries.find(
                      (industry) =>
                        industry.value === clientData?.clientIndustry,
                    )?.label
                  }
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
                                defaultValue={
                                  clientData?.clientIndustry
                                    ? clientData?.clientIndustry
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
          {clientData ? <UpdateButton /> : <SubmitButton />}
          <CancelButton closeDialog={closeDialog} />
        </div>
      </form>
    </Form>
  )
}
