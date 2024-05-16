'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { EstimateFormSchema } from '@/schemas/estimate-form-schema'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { getClientsDataIdAndNameWithContacts } from '@/server/clients/queries'
import { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, CheckIcon, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useFormStatus, useFormState } from 'react-dom'
import { EstimateFormState, createEstimate } from '@/server/estimates/actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'

export function CreateEstimateForm({
  closeDialog,
}: {
  closeDialog: () => void
}) {
  interface ClientData {
    uuid: string
    clientNickName: string
    clientFullName: string
    nickAndFullName: string
    contacts: {
      uuid: string
      contactFirstName: string
      contactLastName: string
      fullName: string
    }[]
  }
  const [openClient, setOpenClient] = useState(false)
  const closeClientPopover = () => {
    setOpenClient(false)
  }

  const [openContact, setOpenContact] = useState(false)
  const closeContactPopover = () => {
    setOpenContact(false)
  }
  const [clientsData, setData] = useState<ClientData[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Fetch your data here
      const data = (await getClientsDataIdAndNameWithContacts()) as ClientData[]
      setData(data)
    }

    fetchData()
  }, [])

  function SubmitButton() {
    const { pending } = useFormStatus()

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creating Estimate...' : 'Create Estimate'}
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

  const initialState: EstimateFormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }
  const [state, formAction] = useFormState(createEstimate, initialState)

  const form = useForm<z.infer<typeof EstimateFormSchema>>({
    resolver: zodResolver(EstimateFormSchema),
  })
  useEffect(() => {
    if (state.actionSuccess === true) {
      closeDialog()
      toast('Estimate Created Succesfully!')
    }
  }, [state])

  return (
    <Form {...form}>
      <form
        action={formAction}
        className=" flex h-full w-full flex-col justify-start gap-y-2"
      >
        <div className="flex h-fit flex-col  gap-y-2 overflow-y-scroll scroll-smooth rounded-2xl p-2 shadow-inner">
          <FormField
            control={form.control}
            name="clientUuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Client</FormLabel>
                <Popover
                  modal={true}
                  open={openClient}
                  onOpenChange={setOpenClient}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          ' justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <input
                          type="hidden"
                          name="clientUuid"
                          value={field.value ? field.value : ''}
                        />
                        {field.value
                          ? clientsData !== null
                            ? clientsData.find(
                                (client) => client.uuid === field.value,
                              )?.nickAndFullName
                            : 'Loading...'
                          : 'Choose Client'}
                        <ChevronsUpDown size={24} strokeWidth={1} />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Clients..."
                        className="h-10"
                      />
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {clientsData &&
                            clientsData.map((client) => (
                              <CommandItem
                                value={client.nickAndFullName}
                                key={client.uuid}
                                onSelect={() => {
                                  form.setValue('clientUuid', client.uuid)
                                  closeClientPopover()
                                }}
                              >
                                {client.nickAndFullName}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    client.uuid === field.value
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
                <div>
                  {state.errors?.clientUuid &&
                    state.errors.clientUuid.map((error: string) => (
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
            name="contactUuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Contact</FormLabel>
                <Popover
                  modal={true}
                  open={openContact}
                  onOpenChange={setOpenContact}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          ' justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <input
                          type="hidden"
                          name="contactUuid"
                          value={field.value ? field.value : ''}
                        />
                        {field.value
                          ? clientsData !== null
                            ? clientsData
                                .find(
                                  (client) =>
                                    client.uuid ===
                                    form.getValues('clientUuid'),
                                )
                                ?.contacts.find(
                                  (contact) => contact.uuid === field.value,
                                )?.fullName
                            : 'Loading...'
                          : 'Choose Contact'}
                        <ChevronsUpDown size={24} strokeWidth={1} />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Contact..."
                        className="h-10"
                      />
                      <CommandEmpty>No contact found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {clientsData &&
                            clientsData
                              ?.find(
                                (client) =>
                                  client.uuid === form.getValues('clientUuid'),
                              )
                              ?.contacts.map((contact) => (
                                <CommandItem
                                  value={contact.fullName}
                                  key={contact.uuid}
                                  onSelect={() => {
                                    form.setValue('contactUuid', contact.uuid)

                                    closeContactPopover()
                                  }}
                                >
                                  {contact.fullName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      contact.uuid === field.value
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
                <div>
                  {state.errors?.contactUuid &&
                    state.errors.contactUuid.map((error: string) => (
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
            name="estimateTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimate Title</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.estimateTitle,
                  })}
                  type="text"
                  placeholder="Excel Printers Private Limited"
                  name="estimateTitle"
                />
                <div>
                  {state.errors?.estimateTitle &&
                    state.errors.estimateTitle.map((error: string) => (
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
            name="estimateDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimate Description</FormLabel>
                <Textarea
                  className={cn('border', {
                    'border-red-500': state.errors?.estimateDescription,
                  })}
                  placeholder="This estimate is for the new visiting cards for Excel. Client is looking for a fresh design with a modern look."
                  name="estimateDescription"
                />
                <div>
                  {state.errors?.estimateDescription &&
                    state.errors.estimateDescription.map((error: string) => (
                      <p className=" text-sm text-red-500" key={error}>
                        {error}
                      </p>
                    ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex h-64 w-full flex-col space-y-2 ">
          {' '}
          <div>
            {
              <p className="text-sm" key={state.message}>
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
