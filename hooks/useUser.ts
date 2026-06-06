import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

export function useUser() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useUser must be used within an AuthProvider")
  }
  return ctx
}
