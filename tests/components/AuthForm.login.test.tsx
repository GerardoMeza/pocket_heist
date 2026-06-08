import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AuthForm from "@/components/AuthForm"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }))

const mockSignIn = vi.fn()
vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
}))

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn().mockReturnValue("TestCodename"),
}))

function fillAndSubmit(email = "test@example.com", password = "password123") {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } })
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } })
  fireEvent.submit(screen.getByRole("form", { name: /log in/i }))
}

describe("AuthForm login", () => {
  beforeEach(() => {
    mockSignIn.mockReset()
  })

  it("renders email input, password input, and log in button", () => {
    render(<AuthForm type="login" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
  })

  it("calls signInWithEmailAndPassword with correct credentials", async () => {
    mockSignIn.mockResolvedValue({})
    render(<AuthForm type="login" />)
    fillAndSubmit("user@example.com", "mypassword")
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({}, "user@example.com", "mypassword")
    })
  })

  it("shows success message and clears fields on resolved promise", async () => {
    mockSignIn.mockResolvedValue({})
    render(<AuthForm type="login" />)
    fillAndSubmit()
    await waitFor(() => {
      expect(screen.getByText("Logged in successfully!")).toBeInTheDocument()
    })
    expect(screen.getByLabelText("Email")).toHaveValue("")
    expect(screen.getByLabelText("Password")).toHaveValue("")
  })

  it("shows mapped error message for known error code", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/invalid-credential" })
    render(<AuthForm type="login" />)
    fillAndSubmit()
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password.")).toBeInTheDocument()
    })
  })

  it("shows generic error message for unknown error code", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/some-unknown-error" })
    render(<AuthForm type="login" />)
    fillAndSubmit()
    await waitFor(() => {
      expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument()
    })
  })

  it("disables inputs and button with loading text while pending", async () => {
    mockSignIn.mockReturnValue(new Promise(() => {}))
    render(<AuthForm type="login" />)
    fillAndSubmit()
    await waitFor(() => {
      expect(screen.getByLabelText("Email")).toBeDisabled()
      expect(screen.getByLabelText("Password")).toBeDisabled()
      expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled()
    })
  })
})
