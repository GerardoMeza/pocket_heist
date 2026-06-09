import { render, screen } from "@testing-library/react"
import RouteGuard from "@/components/RouteGuard"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockReplace = vi.fn()
const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

vi.mock("@/components/Loader", () => ({
  default: () => <div data-testid="loader" />,
}))

describe("RouteGuard", () => {
  beforeEach(() => {
    mockReplace.mockReset()
  })

  it("shows loader while auth state is loading", () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })
    render(
      <RouteGuard requireAuth={true} redirectTo="/login">
        <p>protected</p>
      </RouteGuard>
    )
    expect(screen.getByTestId("loader")).toBeInTheDocument()
    expect(screen.queryByText("protected")).not.toBeInTheDocument()
  })

  it("redirects to /login when requireAuth=true and user is null", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    render(
      <RouteGuard requireAuth={true} redirectTo="/login">
        <p>protected</p>
      </RouteGuard>
    )
    expect(mockReplace).toHaveBeenCalledWith("/login")
    expect(screen.queryByText("protected")).not.toBeInTheDocument()
  })

  it("redirects to /heists when requireAuth=false and user is set", () => {
    mockUseUser.mockReturnValue({ user: { uid: "abc" }, loading: false })
    render(
      <RouteGuard requireAuth={false} redirectTo="/heists">
        <p>public page</p>
      </RouteGuard>
    )
    expect(mockReplace).toHaveBeenCalledWith("/heists")
    expect(screen.queryByText("public page")).not.toBeInTheDocument()
  })

  it("renders children when requireAuth=true and user is set", () => {
    mockUseUser.mockReturnValue({ user: { uid: "abc" }, loading: false })
    render(
      <RouteGuard requireAuth={true} redirectTo="/login">
        <p>dashboard content</p>
      </RouteGuard>
    )
    expect(screen.getByText("dashboard content")).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it("renders children when requireAuth=false and user is null", () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    render(
      <RouteGuard requireAuth={false} redirectTo="/heists">
        <p>login page</p>
      </RouteGuard>
    )
    expect(screen.getByText("login page")).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
