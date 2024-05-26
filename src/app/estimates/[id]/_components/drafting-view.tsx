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
import { createVariation } from '@/server/variations/actions'
import { ChevronDown, Copy, Plus, Trash } from 'lucide-react'
import VariationForm from './variation-form'
import { VariationData } from '@/server/variations/types'
import { useState } from 'react'

export default function DraftingView(props: {
  estimateData: EstimateTableRow
  variationsData: VariationData[]
}) {
  const [loading, setLoading] = useState(false)

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
              <MenubarItem>Option 1</MenubarItem>
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
      <div className="w-ful flex h-full flex-col gap-y-2 overflow-scroll rounded-xl border border-slate-300 p-1 shadow-md">
        {loading ? <div>Loading...</div> : null}
        {props.variationsData.map((variation: any) => {
          return (
            <Card key={variation.uuid}>
              <CardContent>
                <VariationForm variationData={variation}></VariationForm>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
