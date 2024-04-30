'use client'

import { createClient } from '@/server/queries'

export default function CreateClientForm() {
  //   const [state, formAction] = useActionState(createClient, null) // Pass an initial state value

  return (
    <form action={createClient}>
      <button type="submit">Create Client</button>
    </form>
  )
}
