export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed left-16 top-16 flex h-full w-full max-w-full flex-col overflow-y-scroll text-5xl ">
      {children}
    </div>
  )
}
