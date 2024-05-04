'use client'

import { createClient } from '@/server/actions'

import { useFormState } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function CreateClientForm() {
  return (
    <form action={createClient}>
      <div className=" flex flex-col gap-y-2 ">
        <Label>Client Full Name(Required)</Label>
        <Input
          required
          type="text"
          name="clientFullName"
          placeholder="Excel Printers Private Limited"
        />
        {/* <div id="customer-error" aria-live="polite" aria-atomic="true">
          {state.errors?.customerId &&
            state.errors.customerId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
        </div> */}

        <Label>Client Nick Name(Required)</Label>
        <Input required type="text" name="clientNickName" placeholder="Excel" />

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
        <Input type="text" name="gstin" placeholder="22AAAAA0000A1Z5" />

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
        <Input type="text" name="clientAddressState" placeholder="Delhi" />

        <Label>Pincode</Label>
        <Input type="text" name="clientAddressPincode" placeholder="110028" />

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
