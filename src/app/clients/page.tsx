import { getClientsData } from '@/server/queries'
import { DataTable } from './_components/client-data-table'
import PageWrapper from '../_components/page-wrapper'
import { columns } from './columns'

export default async function ClientsDashboard() {
  const clientsData = await getClientsData()

  return (
    <PageWrapper>
      <div className="flex flex-col ">
        <div className="flex flex-row justify-evenly ">
          <div className="flex grow px-4 ">
            {' '}
            <p className="text-2xl">Clients</p>
          </div>
        </div>

        <div className="relative p-4">
          <DataTable columns={columns} data={clientsData} />
        </div>
      </div>
    </PageWrapper>
  )
}
