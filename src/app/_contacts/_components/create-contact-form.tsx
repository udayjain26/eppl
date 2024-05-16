import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ContactFormSchema } from '@/schemas/contact-form-schema'
import { Client } from '@/schemas/schema-table-types'
import { ContactFormState, createContact } from '@/server/contacts/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Contact...' : 'Create Contact'}
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
export function CreateContactForm({
  closeDialog,
  clientData,
}: {
  closeDialog: () => void
  clientData: Client
}) {
  const initialState: ContactFormState = {
    message: null,
    errors: {},
    actionSuccess: null,
  }

  const [state, formAction] = useFormState(createContact, initialState)
  const form = useForm<z.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
  })
  useEffect(() => {
    if (state.actionSuccess === true) {
      closeDialog()
      toast('Contact Created Succesfully!')
    }
  }, [state])

  return (
    <Form {...form}>
      <form
        action={formAction}
        className=" flex h-full w-full flex-col justify-start gap-y-2"
      >
        <div className="flex h-fit flex-col gap-y-2 overflow-y-scroll scroll-smooth rounded-2xl p-1 shadow-inner">
          <input hidden type="text" name="clientUuid" value={clientData.uuid} />

          <FormField
            control={form.control}
            name="contactFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.contactFirstName,
                  })}
                  type="text"
                  placeholder="Uday"
                  name="contactFirstName"
                />
                <div>
                  {state.errors?.contactFirstName &&
                    state.errors.contactFirstName.map((error: string) => (
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
            name="contactLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.contactLastName,
                  })}
                  type="text"
                  placeholder="Jain"
                  name="contactLastName"
                />
                <div>
                  {state.errors?.contactLastName &&
                    state.errors.contactLastName.map((error: string) => (
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
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.contactEmail,
                  })}
                  type="text"
                  placeholder="uday@excelprinters.com"
                  name="contactEmail"
                />
                <div>
                  {state.errors?.contactEmail &&
                    state.errors.contactEmail.map((error: string) => (
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
            name="contactMobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.contactMobile,
                  })}
                  type="text"
                  placeholder="8588835451"
                  name="contactMobile"
                />
                <div>
                  {state.errors?.contactMobile &&
                    state.errors.contactMobile.map((error: string) => (
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
            name="contactDesignation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <Input
                  className={cn('border', {
                    'border-red-500': state.errors?.contactDesignation,
                  })}
                  type="text"
                  placeholder="Software Developer"
                  name="contactDesignation"
                />
                <div>
                  {state.errors?.contactDesignation &&
                    state.errors.contactDesignation.map((error: string) => (
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
