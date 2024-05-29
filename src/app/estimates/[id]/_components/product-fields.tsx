import { PaperData } from '@/server/paper/types'
import CloseSize from './estimation-components/close-size'
import Cover from './estimation-components/cover'
import OpenSize from './estimation-components/open-size'
import Size from './estimation-components/size'

const fieldComponentMap: { [key: string]: React.ComponentType<any> } = {
  size: Size,
  closeSize: CloseSize,
  openSize: OpenSize,
  cover: Cover,
}

const productFieldMap: { [key: string]: string[] } = {
  'Paperback Books': ['closeSize', 'openSize', 'cover'],
  Posters: ['size'],
}
export default function ProductFields(props: {
  control: any
  form: any
  product: string
  paperData: PaperData[]
}) {
  const fields = productFieldMap[props.product] || []

  return (
    <div>
      <h1>Product Specifications</h1>
      {fields.map((field) => {
        const FieldComponent = fieldComponentMap[field]
        return FieldComponent ? (
          <FieldComponent
            key={field}
            control={props.control}
            form={props.form}
            paperData={props.paperData}
          />
        ) : null
      })}
    </div>
  )
}
