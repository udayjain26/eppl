'use client'

import { createClient } from '@/server/actions'

export default function CreateClientForm() {
  return (
    <form action={createClient}>
      <button type="submit">Create Client</button>
    </form>
  )
}
