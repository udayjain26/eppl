import { getClientsData } from '@/server/queries'
import { DataTable } from './_components/client-data-table'
import PageWrapper from '../_components/page-wrapper'
import { columns } from './_components/table-columns'
import Link from 'next/link'

export default async function ClientsDashboard() {
  const clientsData = await getClientsData()

  return (
    <PageWrapper>
      <div className="h-full w-full ">
        <div className="flex flex-row justify-evenly ">
          <div className="flex grow px-4 ">
            {' '}
            <Link href={'/clients'}>
              <p className="text-2xl">Clients</p>
            </Link>
          </div>
        </div>
        <p className=" px-4 text-xs">Total Clients: {clientsData.length}</p>

        <div className="relative h-[80%]  p-4">
          <DataTable columns={columns} data={clientsData} />
        </div>
      </div>
    </PageWrapper>
  )
}
