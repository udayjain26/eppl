import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function RevisionDetailsCard() {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg"></CardTitle>
          <CardDescription></CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1"></div>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold"></div>
        </div>
      </CardContent>
    </Card>
  )
}
