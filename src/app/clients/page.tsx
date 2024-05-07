import PageWrapper from '../_components/page-wrapper'
import { CreateClientDialog } from './_components/create-client-dialog'

export default function ClientsDashboard() {
  return (
    <PageWrapper>
      <div className="flex flex-row justify-evenly ">
        <div className="flex grow"></div>
        <div className="flex ">
          {' '}
          <CreateClientDialog></CreateClientDialog>
        </div>
      </div>
      <div className="h-full w-full bg-red-100 p-4">
        <div className="h-full w-full bg-green-100 p-4"></div>
      </div>
    </PageWrapper>
  )
}
