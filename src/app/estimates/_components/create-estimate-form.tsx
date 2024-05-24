'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { EstimateFormSchema } from '@/schemas/estimate-form-schema'
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
import { createEstimate } from '@/server/estimates/actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { getProductTypesWithProducts } from '@/server/products/queries'
import { useForm } from 'react-hook-form'
import { get } from 'http'
import { getSalesRepsData } from '@/server/salesReps/queries'
import { EstimateFormState } from '@/server/estimates/types'

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
interface ProductsData {
  uuid: string
  createdAt: Date
  createdBy: string
  productsTypeName: string
  products: {
    uuid: string
    createdAt: Date
    createdBy: string
    productsTypeUuid: string
    productName: string
  }[]
}
interface SalesRepsData {
  uuid: string
  createdAt: Date
  createdBy: string
  salesRepName: string
  salesRepMobile: string
  salesRepEmail: string
}
export function CreateEstimateForm({
  closeDialog,
}: {
  closeDialog: () => void
}) {
  const [openClient, setOpenClient] = useState(false)
  const closeClientPopover = () => {
    setOpenClient(false)
  }

  const [openContact, setOpenContact] = useState(false)
  const closeContactPopover = () => {
    setOpenContact(false)
  }

  const [openProductType, setOpenProductType] = useState(false)
  const closeProductTypePopover = () => {
    setOpenProductType(false)
  }

  const [openProduct, setOpenProduct] = useState(false)
  const closeProductPopover = () => {
    setOpenProduct(false)
  }

  const [openSalesRep, setOpenSalesRep] = useState(false)
  const closeSalesRepPopover = () => {
    setOpenSalesRep(false)
  }
  const [clientsData, setClientsData] = useState<ClientData[] | null>(null)
  const [productsData, setProductsData] = useState<ProductsData[] | null>(null)
  const [salesRepsData, setSalesRepsData] = useState<SalesRepsData[] | null>(
    null,
  )

  useEffect(() => {
    const fetchData = async () => {
      // Fetch your data here
      const [fetchedClientsData, fetchedProductsData, fetchedSalesRepsData] =
        await Promise.all([
          getClientsDataIdAndNameWithContacts(),
          getProductTypesWithProducts(),
          getSalesRepsData(),
        ])

      setClientsData(fetchedClientsData as ClientData[])
      setProductsData(fetchedProductsData as ProductsData[])
      setSalesRepsData(fetchedSalesRepsData as SalesRepsData[])
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
      toast.success('Estimate Created Succesfully!')
    } else if (state.actionSuccess === false) {
      toast.error('Failed to Create Estimate')
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
          <FormField
            control={form.control}
            name="estimateProductTypeUuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Product Type</FormLabel>
                <Popover
                  modal={true}
                  open={openProductType}
                  onOpenChange={setOpenProductType}
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
                          name="estimateProductTypeUuid"
                          value={field.value ? field.value : ''}
                        />
                        {field.value
                          ? productsData !== null
                            ? productsData.find(
                                (productType) =>
                                  productType.uuid === field.value,
                              )?.productsTypeName
                            : 'Loading...'
                          : 'Choose Product Type'}
                        <ChevronsUpDown size={24} strokeWidth={1} />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Product Types..."
                        className="h-10"
                      />
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {productsData &&
                            productsData.map((productType) => (
                              <CommandItem
                                value={productType.productsTypeName}
                                key={productType.uuid}
                                onSelect={() => {
                                  form.setValue(
                                    'estimateProductTypeUuid',
                                    productType.uuid,
                                  )
                                  closeProductTypePopover()
                                }}
                              >
                                {productType.productsTypeName}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    productType.uuid === field.value
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
                  {state.errors?.estimateProductTypeUuid &&
                    state.errors.estimateProductTypeUuid.map(
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
            name="estimateProductUuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Product</FormLabel>
                <Popover
                  modal={true}
                  open={openProduct}
                  onOpenChange={setOpenProduct}
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
                          name="estimateProductUuid"
                          value={field.value ? field.value : ''}
                        />
                        {field.value
                          ? productsData !== null
                            ? productsData
                                .find(
                                  (productType) =>
                                    productType.uuid ===
                                    form.getValues('estimateProductTypeUuid'),
                                )
                                ?.products.find(
                                  (product) => product.uuid === field.value,
                                )?.productName
                            : 'Loading...'
                          : 'Choose Product'}
                        <ChevronsUpDown size={24} strokeWidth={1} />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Products..."
                        className="h-10"
                      />
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {productsData &&
                            productsData
                              ?.find(
                                (productType) =>
                                  productType.uuid ===
                                  form.getValues('estimateProductTypeUuid'),
                              )
                              ?.products.map((product) => (
                                <CommandItem
                                  value={product.productName}
                                  key={product.uuid}
                                  onSelect={() => {
                                    form.setValue(
                                      'estimateProductUuid',
                                      product.uuid,
                                    )

                                    closeProductPopover()
                                  }}
                                >
                                  {product.productName}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      product.uuid === field.value
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
                  {state.errors?.estimateProductUuid &&
                    state.errors.estimateProductUuid.map((error: string) => (
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
            name="estimateSalesRepUuid"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-y-1">
                <FormLabel>Sales Rep</FormLabel>
                <Popover
                  modal={true}
                  open={openSalesRep}
                  onOpenChange={setOpenSalesRep}
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
                          name="estimateSalesRepUuid"
                          value={field.value ? field.value : ''}
                        />
                        {field.value
                          ? salesRepsData !== null
                            ? salesRepsData.find(
                                (rep) => rep.uuid === field.value,
                              )?.salesRepName
                            : 'Loading...'
                          : 'Choose Sales Rep'}
                        <ChevronsUpDown size={24} strokeWidth={1} />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Sales Reps..."
                        className="h-10"
                      />
                      <CommandEmpty>No Sales Reps found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {salesRepsData &&
                            salesRepsData.map((rep) => (
                              <CommandItem
                                value={rep.salesRepName}
                                key={rep.uuid}
                                onSelect={() => {
                                  form.setValue(
                                    'estimateSalesRepUuid',
                                    rep.uuid,
                                  )
                                  closeSalesRepPopover()
                                }}
                              >
                                {rep.salesRepName}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    rep.uuid === field.value
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
                  {state.errors?.estimateSalesRepUuid &&
                    state.errors.estimateSalesRepUuid.map((error: string) => (
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
