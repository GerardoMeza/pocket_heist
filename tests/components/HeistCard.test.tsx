import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import HeistCard from "@/components/HeistCard"
import { Heist } from "@/types/firestore/heist"

vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

const baseHeist: Heist = {
  id: "abc123",
  title: "Swap the keyboard keys",
  description: "Classic prank",
  createdBy: "uid-1",
  createdByCodename: "SecretSauceAgent",
  assignedTo: "uid-2",
  assignedToCodename: "KeySmash",
  deadline: new Date("2099-12-07T14:00:00"),
  finalStatus: null,
  createdAt: new Date("2024-01-01"),
}

describe("HeistCard", () => {
  it("renders the heist title", () => {
    render(<HeistCard heist={baseHeist} />)
    expect(screen.getByText("Swap the keyboard keys")).toBeInTheDocument()
  })

  it("title is a link to the heist detail page", () => {
    render(<HeistCard heist={baseHeist} />)
    const link = screen.getByRole("link", { name: /swap the keyboard keys/i })
    expect(link).toHaveAttribute("href", "/heists/abc123")
  })

  it("renders assignedToCodename", () => {
    render(<HeistCard heist={baseHeist} />)
    expect(screen.getByText("KeySmash")).toBeInTheDocument()
  })

  it("renders createdByCodename", () => {
    render(<HeistCard heist={baseHeist} />)
    expect(screen.getByText("SecretSauceAgent")).toBeInTheDocument()
  })

  it("renders the formatted deadline", () => {
    render(<HeistCard heist={baseHeist} />)
    expect(screen.getByText(/Dec 7, 2099/i)).toBeInTheDocument()
  })

  it("renders gracefully when codenames are empty strings", () => {
    const heist = { ...baseHeist, assignedToCodename: "", createdByCodename: "" }
    expect(() => render(<HeistCard heist={heist} />)).not.toThrow()
  })
})
