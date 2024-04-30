import { createClient } from '@/server/queries'
import PageWrapper from '../_components/page-wrapper'
import { useFormState } from 'react-dom'
import { create } from 'domain'
import { use } from 'react'
import CreateClientForm from './_components/create-form'

export default function ClientsPage() {
  return (
    <PageWrapper>
      <CreateClientForm />
    </PageWrapper>
  )
}
