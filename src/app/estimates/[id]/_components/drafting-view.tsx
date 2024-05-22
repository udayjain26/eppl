'use client'

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

export default function DraftingView(props: {
  estimateData: EstimateTableRow
  variationsData: any
}) {
  return (
    <div className="flex h-full w-full flex-col gap-y-2 rounded-xl">
      <div className="flex flex-row">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>
              Variations
              <span>
                <ChevronDown strokeWidth={1} size={24}></ChevronDown>
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onClick={async () => {
                  createVariation('', props.estimateData.uuid)
                }}
              >
                <span>
                  <Plus strokeWidth={1} size={24} className="mr-1"></Plus>
                </span>
                New Variation
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                {' '}
                <span>
                  <Copy strokeWidth={1} size={24} className="mr-1"></Copy>
                </span>
                Clone Variation
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                {' '}
                <span>
                  <Trash strokeWidth={1} size={24} className="mr-1"></Trash>
                </span>
                Delete Variation
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="flex h-full w-full rounded-xl border border-slate-300 shadow-md">
        {props.variationsData.map((variation: any) => {
          return (
            <div>
              {variation.variationTitle}
              <input></input>
            </div>
          )
        })}
      </div>
    </div>
  )
}
