import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import HeistCardSkeleton from "@/components/HeistCardSkeleton"

describe("HeistCardSkeleton", () => {
  it("renders without crashing", () => {
    expect(() => render(<HeistCardSkeleton />)).not.toThrow()
  })
})
