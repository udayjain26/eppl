'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { createVariation, deleteVariation } from '@/server/variations/actions'
import { ChevronDown, Plus, SaveAll, Trash } from 'lucide-react'
import VariationForm from './variation-form'
import { VariationData } from '@/server/variations/types'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CreatePaperForm from '@/app/settings/_components/create-paper-form'
import { PaperData } from '@/server/paper/types'
import CalculationForm from './calculation-form'
import CalculationFields from './calculation-form'

export default function MainView(props: {
  estimateData: EstimateTableRow
  variationsData: VariationData[]
  paperData: PaperData[]
}) {
  const [loading, setLoading] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [openPaperSheet, setOpenPaperSheet] = useState(false)
  const [selectedView, setSelectedView] = useState('specifications') // State for selected view

  const closeDialog = () => {
    setOpenPaperSheet(false)
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-2 rounded-xl">
      <div className="flex flex-row justify-between gap-x-2 p-1">
        {selectedView === 'specifications' ? (
          <div className="flex flex-col justify-center">
            <h1 className=" text-lg font-normal">Specifications View</h1>
          </div>
        ) : null}
        {selectedView === 'calculation' ? (
          <div className="flex flex-col justify-center">
            <h1 className=" text-lg font-normal">Calculation View</h1>
          </div>
        ) : null}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              File
              <span>
                <ChevronDown strokeWidth={1} size={20}></ChevronDown>
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={async () => {
                  setLoading(true)
                  await createVariation(props.estimateData.uuid)
                  setLoading(false)
                }}
              >
                <span>
                  <Plus strokeWidth={1} size={20} className="mr-1"></Plus>
                </span>
                New Variation
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <span>
                  <SaveAll strokeWidth={1} size={20} className="mr-1"></SaveAll>
                </span>
                Save All
              </MenubarItem>
              {/* <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              Edit
              <span>
                <ChevronDown strokeWidth={1} size={20}></ChevronDown>
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={() => setDeleteDialogOpen(true)}
                disabled={!selectedVariation}
                className="text-red-500"
              >
                <span>
                  <Trash className="mr-1" strokeWidth={1} size={20}></Trash>
                </span>{' '}
                Delete Variation{' '}
              </MenubarItem>
              {/* <MenubarSeparator />
              <MenubarItem>Option 2</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              View
              <span>
                <ChevronDown strokeWidth={1} size={20}></ChevronDown>
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setSelectedView('specifications')}>
                Specifications View
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => setSelectedView('calculation')}>
                Calculation View
              </MenubarItem>
              {/* <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              Settings
              <span>
                <ChevronDown strokeWidth={1} size={20}></ChevronDown>
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => setOpenPaperSheet(true)}>
                {' '}
                <span>
                  <Plus strokeWidth={1} size={20} className="mr-1"></Plus>
                </span>
                Create New Paper
              </MenubarItem>
              {/* <MenubarSeparator />
              <MenubarItem>Option 2</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem> */}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      {selectedView === 'specifications' ? (
        <div className="flex h-fit w-full flex-col gap-y-2 overflow-scroll rounded-xl p-1">
          {loading ? <div>Loading...</div> : null}
          {props.variationsData.map((variation) => {
            return (
              <Card
                className={cn('cursor-pointer hover:bg-slate-50', {
                  'border-2 border-slate-500 hover:bg-transparent':
                    selectedVariation === variation.uuid,
                })}
                key={variation.uuid}
                onClick={() => {
                  setSelectedVariation(variation.uuid)
                }}
              >
                <CardContent>
                  <VariationForm
                    variationData={variation}
                    // paperData={props.paperData}
                    product={props.estimateData.product.productName}
                  ></VariationForm>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      {selectedView === 'calculation' ? (
        <div className="flex h-fit w-full flex-col gap-y-2 overflow-scroll rounded-xl p-1">
          {loading ? <div>Loading...</div> : null}
          {props.variationsData.map((variation) => {
            return (
              <Card
                className={cn('cursor-pointer hover:bg-slate-50', {
                  'border-2 border-slate-500 hover:bg-transparent':
                    selectedVariation === variation.uuid,
                })}
                key={variation.uuid}
                onClick={() => {
                  setSelectedVariation(variation.uuid)
                }}
              >
                <CardContent>
                  <CalculationFields
                    variationData={variation}
                    product={props.estimateData.product.productName}
                    paperData={props.paperData}
                  ></CalculationFields>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : null}

      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you wish to delete this variation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This action will{' '}
              <span className="font-bold">permanently delete</span> the
              variation{' '}
              <span className="font-bold underline underline-offset-1">
                {
                  props.variationsData.find(
                    (variation) => variation.uuid === selectedVariation,
                  )?.variationTitle
                }
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const deleteResponse = await deleteVariation(selectedVariation!)
                setDeleteDialogOpen(false)
                if (deleteResponse.actionSuccess == true) {
                  setSelectedVariation(undefined)
                  toast.info(deleteResponse.message)
                }
              }}
              className="bg-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet open={openPaperSheet} onOpenChange={setOpenPaperSheet}>
        <SheetContent
          className="flex h-full flex-col"
          onInteractOutside={(event) => {
            event.preventDefault()
          }}
        >
          <SheetHeader className="">
            <SheetTitle>Create New Paper</SheetTitle>
            <SheetDescription>
              Please fill out the form below to add a paper to the system.
            </SheetDescription>
          </SheetHeader>
          <CreatePaperForm
            estimateUuid={props.estimateData.uuid}
            closeDialog={closeDialog}
          ></CreatePaperForm>
        </SheetContent>
      </Sheet>
    </div>
  )
}
