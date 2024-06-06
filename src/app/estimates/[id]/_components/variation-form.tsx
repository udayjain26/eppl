'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { VariationFormSchema } from '@/schemas/variation-form-schema'
import { saveVariation } from '@/server/variations/actions'
import { VariationData, VariationFormState } from '@/server/variations/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormState, useFormStatus } from 'react-dom'
import {
  useFieldArray,
  useFormState as useFormStateReactHookForm,
} from 'react-hook-form'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Plus, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useEffect } from 'react'
import ProductFields from './product-fields'
import FormError from '@/app/_components/form-error'
import { PaperData } from '@/server/paper/types'

const initialState: VariationFormState = {
  message: null,
  errors: {},
  actionSuccess: null,
}

function SaveButton(props: { isDirty: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-32" disabled={pending || !props.isDirty}>
      {pending ? 'Saving...' : 'Save Variation'}
    </Button>
  )
}

export default function VariationForm(props: {
  variationData: VariationData
  product: string
}) {
  const [state, formAction] = useFormState(saveVariation, initialState)

  const form = useForm<z.infer<typeof VariationFormSchema>>({
    resolver: zodResolver(VariationFormSchema),

    defaultValues: {
      variationTitle: props.variationData.variationTitle,
      variationNotes: props.variationData.variationNotes
        ? props.variationData.variationNotes
        : '',
      clientEnquiry: props.variationData.clientEnquiry
        ? props.variationData.clientEnquiry
        : '',
      variationQtysRates: props.variationData.variationQtysRates,
      closeSizeName: props.variationData.closeSizeName,
      closeSizeLength: props.variationData.closeSizeLength?.toString(),
      closeSizeWidth: props.variationData.closeSizeWidth?.toString(),
      openSizeName: props.variationData.openSizeName,
      openSizeLength: props.variationData.openSizeLength?.toString(),
      openSizeWidth: props.variationData.openSizeWidth?.toString(),
      sizeName: props.variationData.sizeName,
      sizeLength: props.variationData.sizeLength?.toString(),
      sizeWidth: props.variationData.sizeWidth?.toString(),
      coverFrontColors: props.variationData.coverFrontColors,
      coverBackColors: props.variationData.coverBackColors,
      coverPages: props.variationData.coverPages,
      coverLamination: props.variationData.coverLamination,
      coverGrammage: props.variationData.coverGrammage,
      coverPaperType: props.variationData.coverPaperType,
      textColors: props.variationData.textColors,
      textPages: props.variationData.textPages,
      textGrammage: props.variationData.textGrammage,
      textLamination: props.variationData.textLamination,
      textPaperType: props.variationData.textPaperType,
    },
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'variationQtysRates',
    },
  )

  const { isDirty } = useFormStateReactHookForm(form)

  useEffect(() => {
    if (
      state.actionSuccess === true &&
      state.message === 'Variation Saved Successfully!'
    ) {
      toast.success('Variation Saved Successfully!')
      form.reset(form.getValues())
    } else {
      if (state.message) {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <Form {...form}>
      <form action={formAction}>
        <div className="hidden">
          <input
            type="hidden"
            value={props.variationData.uuid}
            {...form.register('uuid')}
          />
          <input
            type="hidden"
            value={props.variationData.estimateUuid}
            {...form.register('estimateUuid')}
          />
        </div>

        <div className="flex flex-row justify-between">
          <div className="flex min-w-64 flex-col">
            <h1>Basic Details</h1>

            <FormField
              control={form.control}
              name="variationTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variation Title</FormLabel>

                  <FormControl>
                    <Input placeholder="Variation Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormError state={state} errorKey="variationTitle"></FormError>
            <FormField
              control={form.control}
              name="variationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32"
                      placeholder="Notes"
                      {...field}
                    ></Textarea>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientEnquiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Enquiry</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-32"
                      placeholder="Client Enquiry"
                      {...field}
                    ></Textarea>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col px-2">
            <div className="flex h-full w-full flex-row gap-x-2 ">
              <div className="flex h-full w-full flex-col ">
                {' '}
                <ProductFields
                  control={form.control}
                  form={form}
                  product={props.product}
                  // paperData={props.paperData}
                ></ProductFields>
              </div>
            </div>
          </div>
          <div className="flex min-w-56 flex-col justify-end gap-y-2">
            <div className="flex h-full w-full flex-col pt-2 ">
              <div className="h-full min-h-48 min-w-24">
                <div className="flex flex-row items-center justify-between px-2 py-2">
                  <h1 className="text-center text-base font-bold">
                    Rates Table
                  </h1>

                  <Button
                    className="h-fit w-fit p-2"
                    variant={'outline'}
                    type="button"
                    onClick={() =>
                      append({
                        uuid: undefined,
                        variationUuid: props.variationData.uuid,
                        quantity: 0,
                        rate: 0,
                      })
                    }
                  >
                    <Plus size={16} strokeWidth={1} />
                  </Button>
                </div>
                <Separator />

                <div className="px-2">
                  <div className="flex flex-row pt-2">
                    <div className=" flex w-20 flex-col ">
                      <p className=" border-b text-center">Quantity</p>
                    </div>

                    <div className="flex w-20 flex-col ">
                      {' '}
                      <p className=" border-b text-center ">Rate</p>
                    </div>
                  </div>
                </div>

                <ul>
                  {fields.map((item, index) => (
                    <li key={item.id}>
                      <div className="flex flex-row gap-x-1 px-2 py-1">
                        <Input
                          className="w-20"
                          {...register(
                            `variationQtysRates.${index}.quantity`,
                            {},
                          )}
                        />
                        <Input
                          className="w-20"
                          readOnly
                          {...register(`variationQtysRates.${index}.rate`, {})}
                        />

                        <Button
                          variant={'outline'}
                          className="h-fit w-fit p-2 "
                          type="button"
                          onClick={() => remove(index)}
                        >
                          {' '}
                          <Trash color="red" size={16} strokeWidth={1} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-row justify-end">
              <SaveButton isDirty={isDirty} />
            </div>
            <FormError state={state} errorKey="variationQtysRates"></FormError>
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-end"> </div>
        </div>
      </form>
    </Form>
  )
}
