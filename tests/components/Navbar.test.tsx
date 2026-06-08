import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Navbar from "@/components/Navbar"

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const mockSignOut = vi.fn()
vi.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}))

vi.mock("@/lib/firebase", () => ({ auth: {} }))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

describe("Navbar", () => {
  beforeEach(() => {
    mockSignOut.mockReset()
    mockUseUser.mockReturnValue({ user: null, loading: false })
  })

  it("renders the main heading", () => {
    render(<Navbar />)
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)
    const createLink = screen.getByRole("link", { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("does not render logout button when user is null", () => {
    render(<Navbar />)
    expect(screen.queryByRole("button", { name: /log out/i })).toBeNull()
  })

  it("renders logout button when user is logged in", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false })
    render(<Navbar />)
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument()
  })

  it("calls signOut when logout button is clicked", () => {
    mockUseUser.mockReturnValue({ user: { uid: "123" }, loading: false })
    mockSignOut.mockResolvedValue(undefined)
    render(<Navbar />)
    fireEvent.click(screen.getByRole("button", { name: /log out/i }))
    expect(mockSignOut).toHaveBeenCalledWith({})
  })
})
