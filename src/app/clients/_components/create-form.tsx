'use client'

import { stateEnum } from '@/server/db/schema'
import { createClient } from '@/server/queries'

export default function CreateClientForm() {
  return (
    <form action={createClient}>
      <button type="submit">Create Client</button>
    </form>
  )
}
