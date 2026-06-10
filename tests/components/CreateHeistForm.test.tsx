import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import CreateHeistForm from "@/components/CreateHeistForm"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/lib/firebase", () => ({ db: {} }))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

const mockGetDocs = vi.fn()
const mockGetDoc = vi.fn()
const mockAddDoc = vi.fn()
const mockCollection = vi.fn()
const mockDoc = vi.fn()
const mockServerTimestamp = vi.fn(() => "SERVER_TIMESTAMP")
vi.mock("firebase/firestore", () => ({
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  serverTimestamp: () => mockServerTimestamp(),
}))

const CURRENT_USER = { uid: "u1" }
const OTHER_USERS = [
  { id: "u2", codename: "SilverFox" },
  { id: "u3", codename: "IronGhost" },
]

function makeUsersDocs(users: { id: string; codename: string }[]) {
  return { docs: users.map(u => ({ data: () => u })) }
}

function makeCurrentUserDoc(codename = "DarkWolf") {
  return { exists: () => true, data: () => ({ id: "u1", codename }) }
}

function getMinDeadline() {
  const d = new Date()
  d.setHours(d.getHours() + 48)
  return d.toISOString().split("T")[0]
}

describe("CreateHeistForm", () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockGetDocs.mockReset()
    mockGetDoc.mockReset()
    mockAddDoc.mockReset()
    mockCollection.mockReset()
    mockDoc.mockReset()
    mockUseUser.mockReturnValue({ user: CURRENT_USER, loading: false })
    mockGetDocs.mockResolvedValue(makeUsersDocs(OTHER_USERS))
    mockGetDoc.mockResolvedValue(makeCurrentUserDoc())
  })

  it("renders title, description, assignee dropdown, and deadline fields", async () => {
    render(<CreateHeistForm />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assign to/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument()
  })

  it("populates the assignee dropdown with users excluding the current user", async () => {
    render(<CreateHeistForm />)
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "SilverFox" })).toBeInTheDocument()
      expect(screen.getByRole("option", { name: "IronGhost" })).toBeInTheDocument()
    })
    expect(screen.queryByRole("option", { name: "DarkWolf" })).toBeNull()
  })

  it("enforces a minimum deadline of 48 hours from now", async () => {
    render(<CreateHeistForm />)
    const deadlineInput = screen.getByLabelText(/deadline/i)
    expect(deadlineInput).toHaveAttribute("min", getMinDeadline())
  })

  it("shows loading state on the submit button while submitting", async () => {
    mockAddDoc.mockReturnValue(new Promise(() => {}))
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "SilverFox" })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "The Big Score" } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Rob the vault" } })
    fireEvent.change(screen.getByLabelText(/assign to/i), { target: { value: "u2" } })
    fireEvent.change(screen.getByLabelText(/deadline/i), { target: { value: getMinDeadline() } })
    fireEvent.submit(screen.getByRole("form"))

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled()
    })
  })

  it("calls addDoc with the correct payload on valid submission", async () => {
    mockAddDoc.mockResolvedValue({ id: "new-heist-id" })
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "SilverFox" })).toBeInTheDocument()
    })

    const deadline = getMinDeadline()
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "The Big Score" } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Rob the vault" } })
    fireEvent.change(screen.getByLabelText(/assign to/i), { target: { value: "u2" } })
    fireEvent.change(screen.getByLabelText(/deadline/i), { target: { value: deadline } })
    fireEvent.submit(screen.getByRole("form"))

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          title: "The Big Score",
          description: "Rob the vault",
          assignedTo: "u2",
          assignedToCodename: "SilverFox",
          createdBy: "u1",
          createdByCodename: "DarkWolf",
          deadline: new Date(deadline),
          finalStatus: null,
          createdAt: "SERVER_TIMESTAMP",
        })
      )
    })
  })

  it("redirects to /heists after successful submission", async () => {
    mockAddDoc.mockResolvedValue({ id: "new-heist-id" })
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "SilverFox" })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "The Big Score" } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Rob the vault" } })
    fireEvent.change(screen.getByLabelText(/assign to/i), { target: { value: "u2" } })
    fireEvent.change(screen.getByLabelText(/deadline/i), { target: { value: getMinDeadline() } })
    fireEvent.submit(screen.getByRole("form"))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists")
    })
  })

  it("displays an error message when the Firestore write fails", async () => {
    mockAddDoc.mockRejectedValue(new Error("Network error"))
    render(<CreateHeistForm />)

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "SilverFox" })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "The Big Score" } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Rob the vault" } })
    fireEvent.change(screen.getByLabelText(/assign to/i), { target: { value: "u2" } })
    fireEvent.change(screen.getByLabelText(/deadline/i), { target: { value: getMinDeadline() } })
    fireEvent.submit(screen.getByRole("form"))

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})
