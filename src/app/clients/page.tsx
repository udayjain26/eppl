import { getClientsData } from '@/server/queries'
import { DataTable } from '../_components/data-table'
import PageWrapper from '../_components/page-wrapper'
import { CreateClientDialog } from './_components/create-client-dialog'
import { columns } from './columns'

export default async function ClientsDashboard() {
  const clientsData = await getClientsData()

  return (
    <PageWrapper>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row justify-evenly px-4">
          <div className="flex grow">
            {' '}
            <p className="text-2xl">Clients</p>
          </div>
          <div className="flex">
            {' '}
            <CreateClientDialog></CreateClientDialog>
          </div>
        </div>

        <div className="p-4">
          <DataTable columns={columns} data={clientsData} />
        </div>
      </div>
    </PageWrapper>
  )
}
