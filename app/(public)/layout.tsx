import RouteGuard from "@/components/RouteGuard"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RouteGuard requireAuth={false} redirectTo="/heists">
      <main className="public">{children}</main>
    </RouteGuard>
  )
}
