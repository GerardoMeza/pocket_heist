import { render, screen } from "@testing-library/react"
import Avatar from "@/components/Avatar"
import { describe, it, expect } from "vitest"

describe("Avatar", () => {
  it("displays the first letter of a simple name", () => {
    render(<Avatar name="alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("displays first 2 uppercase letters for PascalCase names", () => {
    render(<Avatar name="JohnDoe" />)
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("displays first 2 uppercase letters for multi-word PascalCase", () => {
    render(<Avatar name="PocketHeist" />)
    expect(screen.getByText("PH")).toBeInTheDocument()
  })

  it("displays single uppercase letter for single-word name", () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })
})
