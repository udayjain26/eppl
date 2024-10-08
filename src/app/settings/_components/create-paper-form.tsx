import { PaperFormState } from '@/server/paper/types'
import { useFormState, useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import { createPaper } from '@/server/paper/actions'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { PaperFormSchema } from '@/schemas/paper-form-schema'
import { Input } from '@/components/ui/input'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paperFinishes, paperMills, paperTypes } from '../paper-constants'
import { set } from 'date-fns'
import { Sub } from '@radix-ui/react-dropdown-menu'
import FormError from '@/app/_components/form-error'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
const initialState: PaperFormState = {
  message: null,
  errors: {},
  actionSuccess: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="mt-2 w-full" disabled={pending}>
      {pending ? 'Creating Paper Type...' : 'Create Paper'}
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

export default function CreatePaperForm(props: { closeDialog: () => void }) {
  const [lengthInInches, setLengthInInches] = useState('')
  const [widthInInches, setWidthInInches] = useState('')
  const [state, formAction] = useFormState(createPaper, initialState)
  const [openPaperType, setOpenPaperType] = useState(false)

  const [openPaperMill, setOpenPaperMill] = useState(false)
  const [openPaperQuality, setOpenPaperQuality] = useState(false)

  const [openPaperFinish, setOpenPaperFinish] = useState(false)

  const form = useForm<z.infer<typeof PaperFormSchema>>({
    resolver: zodResolver(PaperFormSchema),
  })
  useEffect(() => {
    const generatePaperName = () => {
      // Check if all dependent fields have values
      const allFieldsFilled =
        lengthInInches &&
        widthInInches &&
        form.getValues('paperGrammage') &&
        form.getValues('paperType') &&
        form.getValues('paperMill') &&
        form.getValues('paperFinish')

      // If all fields are filled, generate the paper name
      if (allFieldsFilled) {
        const paperTypeCode = paperTypes.find(
          (row) => row.label === form.getValues('paperType'),
        )?.value
        const name = `${lengthInInches}x${widthInInches}/${form.getValues('paperGrammage')}gsm ${form.getValues('paperMill')} ${form.getValues('paperQuality')} ${form.getValues('paperFinish')}-${paperTypeCode}`
        form.setValue('paperName', name)
      } else {
        // If any field is empty, set paperName to an empty string
        form.setValue('paperName', '')
      }
    }

    // Listen for changes in dependent fields and update paperName
    generatePaperName()
  }, [
    form.watch('paperGrammage'),
    form.watch('paperType'),
    form.watch('paperMill'),
    form.watch('paperQuality'),
    form.watch('paperFinish'),
    lengthInInches,
    widthInInches,
  ])

  useEffect(() => {
    if (state.actionSuccess === true) {
      props.closeDialog()
      toast.success(state.message)
    } else if (state.actionSuccess === false) {
      toast.error(state.message)
    }
  }, [state])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: any,
    setInches: (value: string) => void,
  ) => {
    const value = e.target.value
    const lastChar = value.charAt(value.length - 1)

    if (lastChar === '"') {
      const numericValue = parseFloat(value.slice(0, -1))
      if (!isNaN(numericValue)) {
        const mmValue = (numericValue * 25.4).toFixed(2) // Convert inches to mm
        field.onChange(mmValue)
        setInches(numericValue.toFixed(2))
      } else {
        field.onChange(value.slice(0, -1))
        setInches('')
      }
    } else {
      field.onChange(value)
      const numericValue = parseFloat(value)
      if (!isNaN(numericValue)) {
        setInches((numericValue / 25.4).toFixed(2)) // Convert mm to inches
      } else {
        setInches('')
      }
    }
  }
  return (
    <Form {...form}>
      <form
        action={formAction}
        className=" flex h-full w-full flex-col justify-start gap-y-2"
      >
        <div className="flex max-h-[80%] flex-col gap-y-2  overflow-y-scroll scroll-smooth rounded-2xl p-2 shadow-inner ">
          <FormField
            control={form.control}
            name="paperName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Name</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Paper Name: This field will autofill"
                    {...field}
                    readOnly
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormError state={state} errorKey="paperName" />
          <FormField
            control={form.control}
            name="paperLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Length(mm)</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter values in inches or mm"
                    {...field}
                    onChange={(e) =>
                      handleInputChange(e, field, setLengthInInches)
                    }
                  />
                </FormControl>
                <div className="pl-2 text-sm text-gray-500">
                  {lengthInInches && `(${lengthInInches} in)`}
                </div>
              </FormItem>
            )}
          />
          <FormError state={state} errorKey="paperLength" />
          <FormField
            control={form.control}
            name="paperWidth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Width(mm)</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter values in inches or mm"
                    {...field}
                    onChange={(e) =>
                      handleInputChange(e, field, setWidthInInches)
                    }
                  />
                </FormControl>
                <div className="pl-2 text-sm text-gray-500">
                  {widthInInches && `(${widthInInches} in)`}
                </div>
              </FormItem>
            )}
          />
          <FormError state={state} errorKey="paperWidth" />
          <FormField
            control={form.control}
            name="paperGrammage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Grammage(g/m^2)</FormLabel>

                <FormControl>
                  <Input placeholder="Enter values in grams" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormError state={state} errorKey="paperGrammage" />

          <FormField
            control={form.control}
            name="paperType"
            render={({ field }) => (
              <FormItem
                className="flex w-full 
           flex-col gap-y-1 pt-[6px]"
              >
                <FormLabel>Paper Type</FormLabel>

                <Popover
                  modal={true}
                  open={openPaperType}
                  onOpenChange={setOpenPaperType}
                >
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? paperTypes.find((type) => type.label === field.value)
                            ?.label
                        : 'Select paper type...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search paper types..."
                        className="h-10"
                      />
                      <CommandEmpty>No type found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {paperTypes.map((type) => (
                            <CommandItem
                              key={type.label}
                              value={type.label}
                              onSelect={() => {
                                form.setValue('paperType', type.label)
                                setOpenPaperType(false)
                              }}
                            >
                              {type.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === type.label
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
                <FormError state={state} errorKey="paperType" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paperMill"
            render={({ field }) => (
              <FormItem
                className="flex w-full 
           flex-col gap-y-1 pt-[6px]"
              >
                <FormLabel>Paper Mill</FormLabel>

                <Popover
                  modal={true}
                  open={openPaperMill}
                  onOpenChange={setOpenPaperMill}
                >
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? paperMills.find((make) => make.label === field.value)
                            ?.label
                        : 'Select make type...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search make types..."
                        className="h-10"
                      />
                      <CommandEmpty>No make found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {paperMills.map((make) => (
                            <CommandItem
                              key={make.label}
                              value={make.label}
                              onSelect={() => {
                                form.setValue('paperMill', make.label)
                                form.setValue('paperQuality', '')
                                setOpenPaperMill(false)
                              }}
                            >
                              {make.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === make.label
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
                <FormError state={state} errorKey="paperMill" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperQuality"
            render={({ field }) => (
              <FormItem
                className="flex w-full 
           flex-col gap-y-1 pt-[6px]"
              >
                <FormLabel>Paper Quality</FormLabel>

                <Popover
                  modal={true}
                  open={openPaperQuality}
                  onOpenChange={setOpenPaperQuality}
                >
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? paperMills !== undefined
                          ? paperMills
                              .find(
                                (make) =>
                                  make.label === form.getValues('paperMill'),
                              )
                              ?.qualities.find(
                                (quality) => quality === field.value,
                              )
                          : 'Loading'
                        : 'Select quality type...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search quality types..."
                        className="h-10"
                      />
                      <CommandEmpty>No quality found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {paperMills &&
                            paperMills
                              ?.find(
                                (mill) =>
                                  mill.label === form.getValues('paperMill'),
                              )
                              ?.qualities.map((quality) => (
                                <CommandItem
                                  key={quality}
                                  value={quality}
                                  onSelect={() => {
                                    form.setValue('paperQuality', quality)
                                    setOpenPaperQuality(false)
                                  }}
                                >
                                  {quality}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto h-4 w-4',
                                      field.value === quality
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
                <FormError state={state} errorKey="paperQuality" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paperFinish"
            render={({ field }) => (
              <FormItem
                className="flex w-full 
           flex-col gap-y-1 pt-[6px]"
              >
                <FormLabel>Paper Finish</FormLabel>
                <Popover
                  modal={true}
                  open={openPaperFinish}
                  onOpenChange={setOpenPaperFinish}
                >
                  <PopoverTrigger className="w-full" asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      <input
                        type="hidden"
                        {...field}
                        value={field.value ? field.value : ''}
                      />
                      {field.value
                        ? paperFinishes.find(
                            (make) => make.label === field.value,
                          )?.label
                        : 'Select finish type...'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search finish types..."
                        className="h-10"
                      />
                      <CommandEmpty>No finish found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {paperFinishes.map((make) => (
                            <CommandItem
                              key={make.label}
                              value={make.label}
                              onSelect={() => {
                                form.setValue('paperFinish', make.label)
                                setOpenPaperFinish(false)
                              }}
                            >
                              {make.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  field.value === make.label
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
                <FormError state={state} errorKey="paperFinish" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperDefaultRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paper Default Rate(&#x20B9;)</FormLabel>

                <FormControl>
                  <Input placeholder="Enter values in &#x20B9;" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paperRemarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-32"
                    placeholder="Remarks"
                    {...field}
                  ></Textarea>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col space-y-2 ">
          <SubmitButton />
          <CancelButton closeDialog={props.closeDialog} />
        </div>
      </form>
    </Form>
  )
}
