import { getClientsData } from '@/server/clients/queries'
import { DataTable } from './_components/client-data-table'
import PageWrapper from '../_components/page-wrapper'
import { columns } from './_components/table-columns'
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
          <DataTable columns={columns} data={clientsData} />
        </div>
      </div>

      {/* <div className=" h-full w-full">


        <div className="relative h-full p-4">
          <DataTable columns={columns} data={clientsData} />
        </div>
      </div> */}
    </PageWrapper>
  )
}
