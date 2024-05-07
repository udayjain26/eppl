import PageWrapper from '../_components/page-wrapper'
import { CreateClientDialog } from './_components/dialog-content'

export default function ClientsDashboard() {
  return (
    <PageWrapper>
      <div className="flex flex-row justify-evenly ">
        <div className="flex grow"></div>
        <div className="flex"></div>
        <CreateClientDialog></CreateClientDialog>
      </div>
    </PageWrapper>
  )
}
