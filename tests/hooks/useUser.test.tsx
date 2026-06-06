import { renderHook } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useUser } from "@/hooks/useUser"
import { AuthProvider } from "@/contexts/AuthContext"

vi.mock("@/lib/firebase", () => ({ auth: {} }))

const mockOnAuthStateChanged = vi.fn()
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}))

describe("useUser", () => {
  it("returns { user, loading } when inside AuthProvider", () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn())

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    })

    expect(result.current).toEqual({ user: null, loading: true })
  })

  it("throws when called outside AuthProvider", () => {
    expect(() => renderHook(() => useUser())).toThrow(
      "useUser must be used within an AuthProvider"
    )
  })
})
