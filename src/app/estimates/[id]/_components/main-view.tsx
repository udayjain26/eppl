'use client'

import { useState } from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { ChevronDown, Loader, Plus, SaveAll, Trash } from 'lucide-react'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { VariationData } from '@/server/variations/types'
import VariationForm from './variation-form'
import CalculationFields from './calculation-form'
import { Card, CardContent } from '@/components/ui/card'
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
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import CreatePaperForm from '@/app/settings/_components/create-paper-form'
import { createVariation, deleteVariation } from '@/server/variations/actions'
import { PaperData } from '@/server/paper/types'

export default function MainView(props: {
  estimateData: EstimateTableRow
  variationsData: VariationData[]
  paperData: PaperData[]
}) {
  const [loading, setLoading] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [openPaperSheet, setOpenPaperSheet] = useState(false)
  const [selectedView, setSelectedView] = useState('specifications')
  const [loadingPdf, setLoadingPdf] = useState(false) // New state for PDF loading

  const closeDialog = () => {
    setOpenPaperSheet(false)
  }

  const viewPdf = async () => {
    setLoadingPdf(true) // Set loading state to true
    try {
      // Example: Fetch PDF data from a server endpoint
      const response = await fetch(
        `/estimates/${props.estimateData.uuid}/quotation`,
      ) // Assuming you have an API route to generate PDF

      if (!response.ok) {
        throw new Error('Failed to Fetch PDF')
      }

      // Read the PDF content as a blob
      const blob = await response.blob()

      // Create a URL for the blob object
      const url = URL.createObjectURL(blob)

      // Open a blank tab immediately
      const newTab = window.open('', '_blank')

      // Set the location of the new tab to the URL of the PDF
      if (newTab) {
        newTab.location.href = url
        setLoadingPdf(false) // Set loading state to false once loaded
      }
    } catch (error) {
      toast.error('Failed to fetch PDF')
      setLoadingPdf(false) // Set loading state to false in case of error
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-4 rounded-xl">
      {/* Your existing UI code */}
      <div className="flex h-full w-full flex-col gap-y-4 rounded-xl">
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
                    <SaveAll
                      strokeWidth={1}
                      size={20}
                      className="mr-1"
                    ></SaveAll>
                  </span>
                  Save All
                </MenubarItem>
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
                <MenubarSeparator />
                <MenubarItem onClick={viewPdf}>View PDF</MenubarItem>
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
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        {selectedView === 'specifications' && (
          <div className="flex h-fit w-full flex-col gap-y-2 overflow-scroll rounded-xl p-1">
            {loading && <div>Loading...</div>}
            {props.variationsData.map((variation) => (
              <Card
                className={cn('cursor-pointer hover:bg-slate-50', {
                  'border-2 border-slate-500 hover:bg-transparent':
                    selectedVariation === variation.uuid,
                })}
                key={variation.uuid}
                onClick={() => setSelectedVariation(variation.uuid)}
              >
                <CardContent>
                  <VariationForm
                    variationData={variation}
                    product={props.estimateData.product.productName}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {selectedView === 'calculation' && (
          <div className="flex h-fit w-full flex-col gap-y-2 overflow-scroll rounded-xl p-1">
            {loading && <div>Loading...</div>}
            {props.variationsData.map((variation) => (
              <Card
                className={cn('cursor-pointer hover:bg-slate-50', {
                  'border-2 border-slate-500 hover:bg-transparent':
                    selectedVariation === variation.uuid,
                })}
                key={variation.uuid}
                onClick={() => setSelectedVariation(variation.uuid)}
              >
                <CardContent>
                  <CalculationFields
                    variationData={variation}
                    product={props.estimateData.product.productName}
                    paperData={props.paperData}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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
                  const deleteResponse = await deleteVariation(
                    selectedVariation!,
                  )
                  setDeleteDialogOpen(false)
                  if (deleteResponse.actionSuccess) {
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
            onInteractOutside={(event) => event.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>Create New Paper</SheetTitle>
              <SheetDescription>
                Please fill out the form below to add a paper to the system.
              </SheetDescription>
            </SheetHeader>
            <CreatePaperForm closeDialog={closeDialog} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Loading overlay */}
      {loadingPdf && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-700 opacity-80">
          <div className="text-md flex gap-x-2 text-white">
            <Loader strokeWidth={1} size={20} className="animate-spin" />
            <span>Loading PDF</span>
          </div>
        </div>
      )}
    </div>
  )
}
