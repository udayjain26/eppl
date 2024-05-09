import PageWrapper from '@/app/_components/page-wrapper'
import Link from 'next/link'

export default async function FullClientPage({
  params,
}: {
  params: { uuid: string }
}) {
  const id = params.uuid
  console.log('PLEASE', id)

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
        <p className=" px-4 text-xs">ID: {id}</p>

        {/* <div className="relative h-[80%]  p-4">
          <DataTable columns={columns} data={clientsData} />
        </div> */}
      </div>
    </PageWrapper>
  )
}
