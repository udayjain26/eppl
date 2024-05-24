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
import { useFormState as useFormStateReactHookForm } from 'react-hook-form'

import { useEffect, useRef } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const initialState: VariationFormState = {
  message: null,
  errors: {},
  actionSuccess: null,
}

export default function VariationForm(props: { variationData: VariationData }) {
  const [state, formAction] = useFormState(saveVariation, initialState)
  const form = useForm<z.infer<typeof VariationFormSchema>>({
    resolver: zodResolver(VariationFormSchema),
    defaultValues: {
      variationTitle: props.variationData.variationTitle
        ? props.variationData.variationTitle
        : '',
      variationNotes: props.variationData.variationNotes
        ? props.variationData.variationNotes
        : '',
    },
  })

  // const { control } = form
  const { errors } = useFormStateReactHookForm(form)

  useEffect(() => {
    if (
      state.actionSuccess === true &&
      state.message === 'Variation Saved Successfully!'
    ) {
      toast.success('Variation Saved Successfully!')
    }
  }, [state])

  function SaveButton() {
    const { pending } = useFormStatus()

    return (
      <Button type="submit" className="w-32" disabled={pending}>
        {pending ? 'Saving...' : 'Save Variation'}
      </Button>
    )
  }

  console.log(errors)

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
          <div className="flex w-64 flex-col">
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
            <FormField
              control={form.control}
              name="variationNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>

                  <FormControl>
                    <Textarea placeholder="Notes" {...field}></Textarea>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-end">
            <SaveButton />
          </div>
        </div>
      </form>
    </Form>
  )
}
