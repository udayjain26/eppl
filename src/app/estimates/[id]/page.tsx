import PageWrapper from '@/app/_components/page-wrapper'
import { getClientsData } from '@/server/clients/queries'
import Link from 'next/link'

export default async function FullEstimatePage({
  params,
}: {
  params: { id: string }
}) {
  return <PageWrapper>Test</PageWrapper>
}
