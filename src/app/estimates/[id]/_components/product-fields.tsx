import CloseSize from './specification-components/close-size'
import Cover from './specification-components/cover'
import Text from './specification-components/text'
import OpenSize from './specification-components/open-size'
import Size from './specification-components/size'
import { productFieldMap } from '../../../settings/product-constants'
import { UseFormReturn } from 'react-hook-form'
import Fabrication from './specification-components/fabrication'
import Packaging from './specification-components/packaging'
import Dispatch from './specification-components/dispatch'

const specificationComponentMap: { [key: string]: React.ComponentType<any> } = {
  size: Size,
  closeSize: CloseSize,
  openSize: OpenSize,
  cover: Cover,
  text: Text,
  fabrication: Fabrication,
  packaging: Packaging,
  dispatch: Dispatch,
}

export default function ProductFields(props: {
  control: any
  form: UseFormReturn<any>
  product: string
}) {
  const fields = productFieldMap[props.product]['specificationComponents'] || []

  return (
    <div>
      <h1>Product Specifications</h1>
      {fields.map((component) => {
        const FieldComponent = specificationComponentMap[component]
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
  )
}
