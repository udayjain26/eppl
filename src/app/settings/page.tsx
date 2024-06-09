import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'

export default function Page() {
  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-row ">
          {' '}
          <Link href={'/settings'}>
            <p className="text-2xl">Settings</p>
          </Link>
        </div>
        <div className="flex max-h-[90%] flex-col">
          <div className=" flex flex-row pt-2"> </div>
        </div>
      </div>
    </PageWrapper>
  )
}
