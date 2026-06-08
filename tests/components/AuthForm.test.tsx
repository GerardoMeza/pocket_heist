import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AuthForm from "@/components/AuthForm"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }))

const mockCreateUser = vi.fn()
const mockUpdateProfile = vi.fn()
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}))

const mockDoc = vi.fn()
const mockSetDoc = vi.fn()
vi.mock("firebase/firestore", () => ({
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
}))

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn().mockReturnValue("TestCodename"),
}))

function fillAndSubmit(email = "test@example.com", password = "password123") {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } })
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } })
  fireEvent.submit(screen.getByRole("form", { name: /sign up/i }))
}

describe("AuthForm", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {})
    mockPush.mockReset()
    mockCreateUser.mockReset()
    mockUpdateProfile.mockReset()
    mockSetDoc.mockReset()
    mockDoc.mockReset()
  })

  it("renders email and password fields", () => {
    render(<AuthForm type="login" />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
  })

  it('renders "Log in" button when type is login', () => {
    render(<AuthForm type="login" />)
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
  })

  it('renders "Sign up" button when type is signup', () => {
    render(<AuthForm type="signup" />)
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
  })

  it("password field is hidden by default", () => {
    render(<AuthForm type="login" />)
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("clicking the toggle makes password visible", () => {
    render(<AuthForm type="login" />)
    fireEvent.click(screen.getByRole("button", { name: /show password/i }))
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text")
  })

  it("clicking toggle again hides the password", () => {
    render(<AuthForm type="login" />)
    const toggle = screen.getByRole("button", { name: /show password/i })
    fireEvent.click(toggle)
    fireEvent.click(screen.getByRole("button", { name: /hide password/i }))
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password")
  })

  it("submitting the form logs email and password", () => {
    render(<AuthForm type="login" />)
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret123" } })
    fireEvent.submit(screen.getByRole("form", { name: /log in/i }))
    expect(console.log).toHaveBeenCalledWith({ email: "test@example.com", password: "secret123" })
  })

  it('switch link points to /signup when type is login', () => {
    render(<AuthForm type="login" />)
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/signup")
  })

  it('switch link points to /login when type is signup', () => {
    render(<AuthForm type="signup" />)
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login")
  })

  describe("signup flow", () => {
    it("redirects to /heists on success", async () => {
      const fakeUser = { uid: "uid123" }
      mockCreateUser.mockResolvedValue({ user: fakeUser })
      mockUpdateProfile.mockResolvedValue(undefined)
      mockSetDoc.mockResolvedValue(undefined)

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/heists")
      })
      expect(screen.queryByText("Something went wrong. Please try again.")).toBeNull()
    })

    it("disables inputs and shows loading text during submission", async () => {
      mockCreateUser.mockReturnValue(new Promise(() => {}))

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(screen.getByLabelText("Email")).toBeDisabled()
        expect(screen.getByLabelText("Password")).toBeDisabled()
        expect(screen.getByRole("button", { name: /signing up/i })).toBeDisabled()
      })
    })

    it("shows error for email already in use", async () => {
      mockCreateUser.mockRejectedValue({ code: "auth/email-already-in-use" })

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(screen.getByText("An account with this email already exists.")).toBeInTheDocument()
      })
      expect(mockPush).not.toHaveBeenCalled()
    })

    it("shows error for weak password", async () => {
      mockCreateUser.mockRejectedValue({ code: "auth/weak-password" })

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(screen.getByText("Password must be at least 6 characters.")).toBeInTheDocument()
      })
    })

    it("shows generic error for unknown Firebase errors", async () => {
      mockCreateUser.mockRejectedValue({ code: "auth/some-unknown-error" })

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument()
      })
    })

    it("clears error on successful retry", async () => {
      mockCreateUser.mockRejectedValueOnce({ code: "auth/email-already-in-use" })
      const fakeUser = { uid: "uid123" }
      mockCreateUser.mockResolvedValueOnce({ user: fakeUser })
      mockUpdateProfile.mockResolvedValue(undefined)
      mockSetDoc.mockResolvedValue(undefined)

      render(<AuthForm type="signup" />)
      fillAndSubmit()

      await waitFor(() => {
        expect(screen.getByText("An account with this email already exists.")).toBeInTheDocument()
      })

      fillAndSubmit()

      await waitFor(() => {
        expect(screen.queryByText("An account with this email already exists.")).toBeNull()
        expect(mockPush).toHaveBeenCalledWith("/heists")
      })
    })
  })
})
