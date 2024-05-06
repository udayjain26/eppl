import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
// import CreateClientForm from './_components/create-client-form'
import { CreateClientForm } from './_components/create-client-form-zod'

export default function ClientsDashboard() {
  return (
    <PageWrapper>
      <div className="flex flex-row justify-evenly ">
        <div className="flex grow"></div>
        <div className="flex">
          <Dialog>
            <DialogTrigger className={buttonVariants()}>
              <span className="pr-1">
                <Plus strokeWidth="1" size={28}></Plus>
              </span>
              Create Client
            </DialogTrigger>
            <DialogContent className="flex h-full flex-col overflow-y-scroll overscroll-auto">
              <DialogHeader>
                <DialogTitle>Client Creation Form</DialogTitle>
                <DialogDescription>
                  Please fill out the form below to add a client to the system.
                </DialogDescription>
              </DialogHeader>
              {/* <CreateClientForm /> */}
              <CreateClientForm></CreateClientForm>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageWrapper>
  )
}
