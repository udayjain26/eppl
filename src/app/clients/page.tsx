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
import CreateClientForm from './_components/create-client-form'

export default function ClientsDashboard() {
  return (
    <PageWrapper>
      <div className="flex flex-row justify-evenly">
        <div className="flex grow"></div>
        <div className="flex">
          <Dialog>
            <DialogTrigger className={buttonVariants()}>
              <span className="pr-1">
                <Plus strokeWidth="1" size={28}></Plus>
              </span>
              Create Client
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Client Creation Form</DialogTitle>
                <DialogDescription>
                  Please fill out the form below to add a client to the system.
                </DialogDescription>
              </DialogHeader>
              <CreateClientForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageWrapper>
  )
}
