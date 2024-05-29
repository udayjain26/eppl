export default function FormError(props: { state: any; errorKey: string }) {
  return (
    <div>
      {props.state.errors?.[props.errorKey] &&
        props.state.errors[props.errorKey].map((error: string) => (
          <p className=" text-sm text-red-500" key={error}>
            {error}
          </p>
        ))}
    </div>
  )
}
