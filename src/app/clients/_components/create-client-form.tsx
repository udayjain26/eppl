'use client'

import { createClient } from '@/server/actions'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

export default function CreateClientForm() {
  return (
    <form action={createClient}>
      <input
        required
        type="text"
        name="clientFullName"
        placeholder="Client Full Name"
      />
      <input
        required
        type="text"
        name="clientNickName"
        placeholder="Client Nick Name"
      />
      <input type="text" name="gstin" placeholder="gstin" />
      <input
        required
        type="radio"
        id="isNewClient"
        name="isNewClient"
        value="true"
      />
      <label>New Client</label>

      <input
        required
        type="radio"
        id="isNewClient"
        name="isNewClient"
        value="false"
      />
      <label>Existing Client</label>

      <input
        type="text"
        name="clientAddressLine1"
        placeholder="Street Address 1"
      />
      <input
        type="text"
        name="clientAddressLine2"
        placeholder="Street Address 2"
      />
      <input type="text" name="clientAddressCity" placeholder="City" />
      <input type="text" name="ClientAddressState" placeholder="State" />
      <input type="text" name="clientAddressPincode" placeholder="Pincode" />

      <button type="submit">Create Client</button>
    </form>
  )
}
