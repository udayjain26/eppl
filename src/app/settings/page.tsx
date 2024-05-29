import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'
import CreatePaperSheet from './_components/create-paper-sheet'

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
          <div className=" flex flex-row pt-2">
            {' '}
            {/* <CreatePaperSheet /> */}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
