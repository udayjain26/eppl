'use client'

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
import { ChevronDown, Copy, Plus, Trash } from 'lucide-react'
import VariationForm from './variation-form'
import { VariationData } from '@/server/variations/types'
import { useState } from 'react'
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function DraftingView(props: {
  estimateData: EstimateTableRow
  variationsData: VariationData[]
}) {
  const [loading, setLoading] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<string>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <div className="flex h-full w-full flex-col gap-y-2 rounded-xl">
      <div className="flex flex-row">
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
              <MenubarItem>Option 2</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem>
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
              <MenubarSeparator />
              <MenubarItem>Option 2</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem>
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
              <MenubarItem>Option 1</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 2</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Option 3</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="w-ful flex h-full flex-col gap-y-2 overflow-scroll rounded-xl   p-1 ">
        {loading ? <div>Loading...</div> : null}
        {props.variationsData.map((variation: any) => {
          return (
            <Card
              className={cn('cursor-pointer hover:bg-slate-50', {
                'border-2 border-slate-500':
                  selectedVariation === variation.uuid,
              })}
              key={variation.uuid}
              onClick={() => {
                setSelectedVariation(variation.uuid)
              }}
            >
              <CardContent>
                <VariationForm variationData={variation}></VariationForm>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <AlertDialog open={deleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you wish to delete this variation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will{' '}
              <span className="font-bold">permanently delete</span> variation{' '}
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
    </div>
  )
}
