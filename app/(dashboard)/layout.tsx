import RouteGuard from "@/components/RouteGuard"
import Navbar from "@/components/Navbar"

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      <Navbar />
      <main>{children}</main>
    </RouteGuard>
  )
}
