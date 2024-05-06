'use client'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ShowToastButton() {
  return (
    <Button
      onClick={() => {
        console.log('This does not work')
        toast('This does not work')
      }}
    >
      Hello
    </Button>
  )
}
