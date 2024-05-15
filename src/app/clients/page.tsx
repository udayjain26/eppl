import { getClientsData } from '@/server/clients/queries'
import { ClientDataTable } from './_components/client-data-table'
import PageWrapper from '../_components/page-wrapper'
import { clientColumns } from './_components/table-columns'
import Link from 'next/link'

export default async function ClientsDashboard() {
  const clientsData = await getClientsData()

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-row ">
          {' '}
          <Link href={'/clients'}>
            <p className="text-2xl">Clients</p>
          </Link>
        </div>
        <p className=" text-xs">Total Clients: {clientsData.length}</p>
        <div className="flex max-h-[90%] flex-col">
          {' '}
          <ClientDataTable columns={clientColumns} data={clientsData} />
        </div>
      </div>
    </PageWrapper>
  )
}
