'use client'

import { FormState, createClient } from '@/server/actions'

import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { error } from 'console'
import { cn } from '@/lib/utils'
import { stateEnum } from '@/server/db/schema'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { CheckIcon } from 'lucide-react'

// export function FormError(state: FormState, argument) {
//   return (

//   )
// }

export default function CreateClientForm() {
  const states = Object.values(stateEnum.enumValues)
  const initialState: FormState = { message: null, errors: {} }
  const [state, formAction] = useFormState(createClient, initialState)

  // return (
  //   <Form {...form}>
  //     <form className="space-y-6">
  //       <FormField
  //         control={form.control}
  //         name="language"
  //         render={({ field }) => (
  //           <FormItem className="flex flex-col">
  //             <FormLabel>Language</FormLabel>
  //             <Popover>
  //               <PopoverTrigger asChild>
  //                 <FormControl>
  //                   <Button
  //                     variant="outline"
  //                     role="combobox"
  //                     className={cn(
  //                       'w-[200px] justify-between',
  //                       !field.value && 'text-muted-foreground',
  //                     )}
  //                   >
  //                     {field.value
  //                       ? languages.find(
  //                           (language) => language.value === field.value,
  //                         )?.label
  //                       : 'Select language'}
  //                     {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
  //                   </Button>
  //                 </FormControl>
  //               </PopoverTrigger>
  //               <PopoverContent className="w-[200px] p-0">
  //                 <Command>
  //                   <CommandInput
  //                     placeholder="Search framework..."
  //                     className="h-9"
  //                   />
  //                   <CommandEmpty>No framework found.</CommandEmpty>
  //                   <CommandGroup>
  //                     {states.map((language) => (
  //                       <CommandItem
  //                         value={language}
  //                         key={language}
  //                         onSelect={() => {
  //                           form.setValue('language', language)
  //                         }}
  //                       >
  //                         {language}
  //                         <CheckIcon
  //                           className={cn(
  //                             'ml-auto h-4 w-4',
  //                             language === field.value
  //                               ? 'opacity-100'
  //                               : 'opacity-0',
  //                           )}
  //                         />
  //                       </CommandItem>
  //                     ))}
  //                   </CommandGroup>
  //                 </Command>
  //               </PopoverContent>
  //             </Popover>
  //             <FormDescription>
  //               This is the language that will be used in the dashboard.
  //             </FormDescription>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />
  //       <Button type="submit">Submit</Button>
  //     </form>
  //   </Form>
  // )

  return (
    <form action={formAction}>
      <div className=" flex flex-col gap-y-2 ">
        <Label>Client Full Name(Required)</Label>
        <Input
          className={cn('border', {
            'border-red-500': state.errors?.clientFullName,
          })}
          type="text"
          name="clientFullName"
          placeholder="Excel Printers Private Limited"
        />
        <div>
          {state.errors?.clientFullName &&
            state.errors.clientFullName.map((error: string) => (
              <p className=" text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <Label>Client Nick Name(Required)</Label>
        <Input
          type="text"
          name="clientNickName"
          placeholder="Excel"
          className={cn('border', {
            'border-red-500': state.errors?.clientNickName,
          })}
        />
        <div>
          {state.errors?.clientNickName &&
            state.errors.clientNickName.map((error: string) => (
              <p className=" text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <div className="my-1 ">
          <Label>Is this a new client?</Label>
          <RadioGroup name="isNewClient" defaultValue="true">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" />
              <Label>New Client</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" />
              <Label>Existing Client</Label>
            </div>
          </RadioGroup>
        </div>

        <Label>GST Identification Number</Label>
        <Input
          type="text"
          name="gstin"
          placeholder="22AAAAA0000A1Z5"
          className={cn('border', {
            'border-red-500': state.errors?.gstin,
          })}
        />
        <div>
          {state.errors?.gstin &&
            state.errors.gstin.map((error: string) => (
              <p className=" text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        <Label>Street Address 1</Label>
        <Input
          type="text"
          name="clientAddressLine1"
          placeholder="A-82, Third Floor"
        />

        <Label>Street Address 2</Label>
        <Input
          type="text"
          name="clientAddressLine2"
          placeholder=" Narania Inustrial Area Phase 1"
        />

        <Label>City</Label>
        <Input type="text" name="clientAddressCity" placeholder="New Delhi" />

        <Label>State</Label>
        {/* <Input type="text" name="clientAddressState" placeholder="Delhi" /> */}
        {/* <select
          name="clientAddressState"
          className="p peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
          defaultValue=""
        >
          <option value="" disabled>
            Select a State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select> */}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'}></Button>
          </PopoverTrigger>
          <PopoverContent className="">
            <Command>
              {/* <CommandInput
                name="clientAddressState"
                placeholder="Search state..."
                className="h-12"
              /> */}
              {/* <CommandEmpty>No state found.</CommandEmpty> */}
              {/* <CommandGroup>
                <CommandItem>Red</CommandItem>
                {states.map((state) => (
                  <CommandItem
                    value={state}
                    key={state}
                    onSelect={() => {
                      // formData.set('State', state)
                    }}
                  >
                    {state}
                    <CheckIcon />
                  </CommandItem>
                ))}
              </CommandGroup> */}
            </Command>
          </PopoverContent>
        </Popover>

        <Label>Pincode</Label>
        <Input
          type="text"
          name="clientAddressPincode"
          placeholder="110028"
          className={cn('border', {
            'border-red-500': state.errors?.clientAddressPincode,
          })}
        />
        <div>
          {state.errors?.clientAddressPincode &&
            state.errors.clientAddressPincode.map((error: string) => (
              <p className=" text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div>

        {/* <DialogClose> */}
        <div className="flex justify-evenly pt-4 ">
          <Button className="min-w-full" type="submit">
            Create Client
          </Button>
        </div>
        {/* </DialogClose> */}
      </div>
    </form>
  )
}
