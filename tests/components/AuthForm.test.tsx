import { render, screen, fireEvent } from "@testing-library/react"
import AuthForm from "@/components/AuthForm"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe("AuthForm", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {})
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
})
