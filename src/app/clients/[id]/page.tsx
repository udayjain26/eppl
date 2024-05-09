import PageWrapper from '@/app/_components/page-wrapper'
import { getClientById } from '@/server/queries'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function FullClientPage({
  params,
}: {
  params: { id: string }
}) {
  const uuid = params.id

  const clientData = await getClientById(uuid)

  return (
    <PageWrapper>
      <div className="h-full w-full ">
        <div className="flex flex-row justify-evenly ">
          <div className="flex grow items-center px-4">
            {' '}
            <Link href={'/clients'}>
              <p className="text-2xl">Clients</p>
            </Link>
            <ChevronRight size={28} strokeWidth="1" />
            <Link href={`/clients/${uuid}`}>
              <p className="text-2xl">{clientData.clientNickName}</p>
            </Link>
          </div>
        </div>
        {/* <p className="text-md px-4 text-gray-700">
          {clientData.clientNickName}
        </p> */}

        {/* <div className="relative h-[80%]  p-4">
          <DataTable columns={columns} data={clientsData} />
        </div> */}
      </div>
    </PageWrapper>
  )
}
