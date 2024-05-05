import { ArrowRight } from 'lucide-react'

export default function SignInPrompt() {
  return (
    <div className="flex items-center sm:flex-grow sm:justify-center sm:gap-1">
      {' '}
      <div className="w-36 sm:w-fit ">
        Welcome to the EPPL Portal. Please Sign in To Continue{' '}
      </div>
      <span>
        <ArrowRight strokeWidth={1} size={24} />
      </span>
    </div>
  )
}
