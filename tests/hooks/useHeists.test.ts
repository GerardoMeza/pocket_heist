import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/firebase", () => ({ db: {} }))

const mockUseUser = vi.fn()
vi.mock("@/hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}))

const mockOnSnapshot = vi.fn()
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockWhere = vi.fn()
const mockWithConverter = vi.fn()
const mockTimestampNow = vi.fn(() => "NOW_TIMESTAMP")

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  Timestamp: { now: () => mockTimestampNow() },
}))

vi.mock("@/types/firestore/converters", () => ({
  heistConverter: { withConverter: vi.fn() },
}))

const USER = { uid: "u1" }

function makeSnapshot(titles: string[]) {
  return {
    docs: titles.map(title => ({
      id: "id",
      data: () => ({ title, description: "", createdBy: "u1", createdByCodename: "X", assignedTo: "u1", assignedToCodename: "Y", finalStatus: null }),
      get: (field: string) => field === "title" ? title : null,
    })),
  }
}

describe("useHeists", () => {
  let unsubscribe: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    unsubscribe = vi.fn()
    mockUseUser.mockReturnValue({ user: USER, loading: false })
    mockCollection.mockReturnValue({ withConverter: mockWithConverter })
    mockWithConverter.mockReturnValue("collectionRef")
    mockQuery.mockReturnValue("queryRef")
    mockWhere.mockReturnValue("whereClause")
    mockOnSnapshot.mockImplementation((_query, callback) => {
      callback(makeSnapshot([]))
      return unsubscribe
    })
  })

  it("returns empty array when user is null", async () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })

    const { useHeists } = await import("@/hooks/useHeists")
    const { result } = renderHook(() => useHeists("active"))

    expect(result.current.heists).toEqual([])
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it("queries with correct where clauses for 'active'", async () => {
    const { useHeists } = await import("@/hooks/useHeists")
    renderHook(() => useHeists("active"))

    expect(mockWhere).toHaveBeenCalledWith("assignedTo", "==", USER.uid)
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "NOW_TIMESTAMP")
  })

  it("queries with correct where clauses for 'assigned'", async () => {
    const { useHeists } = await import("@/hooks/useHeists")
    renderHook(() => useHeists("assigned"))

    expect(mockWhere).toHaveBeenCalledWith("createdBy", "==", USER.uid)
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", "NOW_TIMESTAMP")
  })

  it("queries with correct where clauses for 'expired'", async () => {
    const { useHeists } = await import("@/hooks/useHeists")
    renderHook(() => useHeists("expired"))

    expect(mockWhere).toHaveBeenCalledWith("deadline", "<=", "NOW_TIMESTAMP")
    expect(mockWhere).toHaveBeenCalledWith("finalStatus", "!=", null)
  })

  it("returns heists from the snapshot", async () => {
    mockOnSnapshot.mockImplementation((_query, callback) => {
      callback(makeSnapshot(["Steal the Mona Lisa", "Rob Fort Knox"]))
      return unsubscribe
    })

    const { useHeists } = await import("@/hooks/useHeists")
    const { result } = renderHook(() => useHeists("active"))

    expect(result.current.heists).toHaveLength(2)
    expect(result.current.heists[0].title).toBe("Steal the Mona Lisa")
  })

  it("unsubscribes from onSnapshot on unmount", async () => {
    const { useHeists } = await import("@/hooks/useHeists")
    const { unmount } = renderHook(() => useHeists("active"))

    unmount()

    expect(unsubscribe).toHaveBeenCalled()
  })
})
