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
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
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
  const [isChanged, setIsChanged] = useState(false)

  const form = useForm<z.infer<typeof VariationFormSchema>>({
    resolver: zodResolver(VariationFormSchema),
    defaultValues: {
      variationTitle: props.variationData.variationTitle!,
      variationNotes: props.variationData.variationNotes!,
    },
  })
  const { watch, reset } = form

  useEffect(() => {
    reset()
  }, [])
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const isFormChanged = Object.keys(props.variationData).some(
        (key) =>
          (value as VariationData)[key as keyof VariationData] !==
          props.variationData[key as keyof VariationData],
      )
      setIsChanged(isFormChanged)
    })
    return () => subscription.unsubscribe()
  }, [watch, props.variationData])

  const SaveButton = () => {
    const { pending } = useFormStatus()

    useEffect(() => {
      console.log('Ran ')
      if (
        state.actionSuccess === true &&
        state.message === 'Variation Saved Successfully!'
      ) {
        toast('Variation Saved Successfully!')
      }
    }, [state])
    return (
      <Button type="submit" className="w-32" disabled={pending || !isChanged}>
        {pending ? 'Saving...' : 'Save Variation'}
      </Button>
    )
  }

  return (
    <Form {...form}>
      <form action={formAction}>
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

        <div className="flex flex-row justify-between">
          <div className="flex w-64 flex-col">
            <FormField
              control={form.control}
              name="variationTitle"
              render={() => (
                <FormItem>
                  <FormLabel>Variation Title</FormLabel>

                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Variation Title"
                      {...form.register('variationTitle')}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variationNotes"
              render={() => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Notes"
                      // defaultValue={props.variationData!.variationNotes!}
                      {...form.register('variationNotes')}
                    />
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
