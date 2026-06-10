import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import HeistsPage from "@/app/(dashboard)/heists/page"
import { Heist } from "@/types/firestore/heist"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockUseHeists = vi.fn()
vi.mock("@/hooks/useHeists", () => ({
  useHeists: (filter: string) => mockUseHeists(filter),
}))

const sampleHeist: Heist = {
  id: "h1",
  title: "Prank Mission Alpha",
  description: "desc",
  createdBy: "uid-1",
  createdByCodename: "AgentX",
  assignedTo: "uid-2",
  assignedToCodename: "TargetY",
  deadline: new Date("2099-01-01"),
  finalStatus: null,
  createdAt: new Date("2024-01-01"),
}

describe("HeistsPage", () => {
  beforeEach(() => {
    mockUseHeists.mockReturnValue({ heists: [], loading: false, error: null })
  })

  it("shows skeletons while active heists are loading", () => {
    mockUseHeists.mockImplementation((filter: string) => {
      if (filter === "active") return { heists: [], loading: true, error: null }
      return { heists: [], loading: false, error: null }
    })
    const { container } = render(<HeistsPage />)
    const skeletons = container.querySelectorAll("[data-testid='heist-card-skeleton']")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("does not render an expired heists section", () => {
    render(<HeistsPage />)
    expect(screen.queryByText(/expired/i)).toBeNull()
  })

  it("shows an empty state when there are no active heists", () => {
    render(<HeistsPage />)
    expect(screen.getByText(/no active heists/i)).toBeInTheDocument()
  })

  it("renders heist cards when heists are present", () => {
    mockUseHeists.mockImplementation((filter: string) => {
      if (filter === "active") return { heists: [sampleHeist], loading: false, error: null }
      return { heists: [], loading: false, error: null }
    })
    render(<HeistsPage />)
    expect(screen.getByText("Prank Mission Alpha")).toBeInTheDocument()
  })
})
