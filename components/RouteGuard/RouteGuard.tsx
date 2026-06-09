"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import Loader from "@/components/Loader"

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth: boolean
  redirectTo: string
}

export default function RouteGuard({ children, requireAuth, redirectTo }: RouteGuardProps) {
  const { user, loading } = useUser()
  const router = useRouter()

  const shouldRedirect = !loading && (requireAuth ? !user : !!user)

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(redirectTo)
    }
  }, [shouldRedirect, redirectTo, router])

  if (loading || shouldRedirect) {
    return <Loader />
  }

  return <>{children}</>
}
