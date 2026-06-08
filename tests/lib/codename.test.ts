import { describe, it, expect } from "vitest"
import { generateCodename } from "@/lib/codename"

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename()).toBeTruthy()
  })

  it("contains no spaces or separators", () => {
    expect(generateCodename()).not.toMatch(/[\s_-]/)
  })

  it("is at least 6 characters long", () => {
    expect(generateCodename().length).toBeGreaterThanOrEqual(6)
  })

  it("contains 2 or 3 PascalCase words", () => {
    const words = generateCodename().match(/[A-Z][a-z]+/g)
    expect(words).not.toBeNull()
    expect(words!.length).toBeGreaterThanOrEqual(2)
    expect(words!.length).toBeLessThanOrEqual(3)
  })

  it("each word starts with an uppercase letter", () => {
    const words = generateCodename().match(/[A-Z][a-z]+/g)!
    words.forEach(word => {
      expect(word[0]).toMatch(/[A-Z]/)
    })
  })

  it("always produces valid codenames across 50 calls", () => {
    for (let i = 0; i < 50; i++) {
      const codename = generateCodename()
      const words = codename.match(/[A-Z][a-z]+/g)
      expect(words).not.toBeNull()
      expect(words!.length).toBeGreaterThanOrEqual(2)
      expect(words!.length).toBeLessThanOrEqual(3)
      expect(codename).not.toMatch(/[\s_-]/)
    }
  })
})
