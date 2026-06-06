import { render, screen, waitFor, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AuthProvider, AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

vi.mock("@/lib/firebase", () => ({ auth: {} }))

const mockOnAuthStateChanged = vi.fn()
vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}))

function UserDisplay() {
  const ctx = useContext(AuthContext)
  if (!ctx) return null
  return (
    <div>
      <span data-testid="loading">{String(ctx.loading)}</span>
      <span data-testid="user">{ctx.user ? ctx.user.email : "null"}</span>
    </div>
  )
}

beforeEach(() => {
  mockOnAuthStateChanged.mockReset()
})

describe("AuthProvider", () => {
  it("loading is true before onAuthStateChanged fires", () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn())

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    )

    expect(screen.getByTestId("loading").textContent).toBe("true")
  })

  it("sets user and loading:false when callback fires with a user", async () => {
    const fakeUser = { uid: "abc123", email: "test@example.com" }
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (u: unknown) => void) => {
      callback(fakeUser)
      return vi.fn()
    })

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false")
      expect(screen.getByTestId("user").textContent).toBe("test@example.com")
    })
  })

  it("sets user:null and loading:false when callback fires with null", async () => {
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (u: null) => void) => {
      callback(null)
      return vi.fn()
    })

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false")
      expect(screen.getByTestId("user").textContent).toBe("null")
    })
  })

  it("calls the unsubscribe function on unmount", () => {
    const unsubscribe = vi.fn()
    mockOnAuthStateChanged.mockImplementation(() => unsubscribe)

    const { unmount } = render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    )

    unmount()
    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
