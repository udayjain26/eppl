import MySep from '@/app/_components/custom-sep'
import { productFieldMap } from '@/app/settings/product-constants'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import PaperbackBookBinding from './paperback-book-binding'
import CoverUV from './cover-uv'
import VDPComp from './vdp'
import CatalogBrochureBinding from './catalog-brochure-binding'
import Gumming from './gumming'
import { text } from 'stream/consumers'
import TextCoating from './text-coating'
import CoverCoating from './cover-coating'

export default function Fabrication(props: {
  control: any
  form: UseFormReturn
  product: string
}) {
  const [open, setOpen] = React.useState(false)

  const fabricationComponentMap: { [key: string]: React.ComponentType<any> } = {
    paperbackBookBinding: PaperbackBookBinding,
    catalogBrochureBinding: CatalogBrochureBinding,
    coverUV: CoverUV,
    vdp: VDPComp,
    gumming: Gumming,
    textCoating: TextCoating,
    coverCoating: CoverCoating,
  }
  const fabricationFields =
    productFieldMap[props.product]['fabricationComponents'] || []

  return (
    <div className="flex flex-col pt-4">
      <h1>Fabrication Details</h1>
      <div className="flex min-h-fit flex-row flex-wrap gap-x-4">
        {fabricationFields.map((component) => {
          const FieldComponent = fabricationComponentMap[component]
          return FieldComponent ? (
            <FieldComponent
              key={component}
              control={props.control}
              form={props.form}
              product={props.product}
            />
          ) : null
        })}
      </div>
      <MySep />
    </div>
  )
}
