import { ArrowRight } from 'lucide-react'

export default function SignInPrompt() {
  return (
    <div className="flex flex-grow items-center justify-center gap-1 ">
      {' '}
      Welcome to the EPPL Portal. Please Sign in To Continue{' '}
      <span>
        <ArrowRight strokeWidth={1} size={24} />
      </span>
    </div>
  )
}
