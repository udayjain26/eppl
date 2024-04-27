export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed left-16 top-16 -m-2 flex h-full w-full max-w-full flex-col overflow-y-scroll rounded-3xl bg-white p-2">
      {children}
    </div>
  )
}
