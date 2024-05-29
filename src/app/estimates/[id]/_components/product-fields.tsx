import CloseSize from './estimation-components/close-size'
import Size from './estimation-components/size'

const fieldComponentMap: { [key: string]: React.ComponentType<any> } = {
  size: Size,
  closeSize: CloseSize,
  // Add other field-component mappings here
}

const productFieldMap: { [key: string]: string[] } = {
  'Paperback Books': ['closeSize'],
  Posters: ['size'],
}
export default function ProductFields(props: {
  control: any
  form: any
  product: string
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
          />
        ) : null
      })}
    </div>
  )
}
