# Plan: Heist Card Component

## Context
The `/heists` page currently renders raw `<li>` text items for active, assigned, and expired heists. This plan implements a styled `HeistCard` component (matching the Figma design) and a `HeistCardSkeleton`, updates the heists page to show cards in a responsive 3-column grid, and stubs out the `/heists/[id]` detail route.

---

## Steps

### 1. `HeistCard` component
**New files:**
- `components/HeistCard/HeistCard.tsx`
- `components/HeistCard/HeistCard.module.css`
- `components/HeistCard/index.ts`

**Props** (from `Heist` type in `types/firestore/heist.ts`):
```ts
{ heist: Heist }
```

**Template structure:**
```
<article>
  [decorative illustration — static img]
  <Link href={`/heists/${heist.id}`}><h3>{heist.title}</h3></Link>
  <ul>
    <li>[person icon] To: {heist.assignedToCodename}</li>
    <li>[person icon] By: {heist.createdByCodename}</li>
    <li>[clock icon] {formatted deadline}</li>
  </ul>
</article>
```

**Visual spec (from Figma):**
- Background: gradient 58.4° from `#f6d465` → `#fff`
- Border radius: 23px
- Padding: 28px vertical, 21px horizontal
- Title: Inter Medium 20px, white
- Metadata: Inter Regular 14px, `text-body` (`#99A1AF`)
- `assignedToCodename`: color `primary` (`#C27AFF`)
- `createdByCodename`: color `secondary` (`#FB64B6`)
- Icons: use `lucide-react` — `User` (12px) for To/By, `CalendarClock` (12px) for deadline
- Decorative illustration: static image asset (can use a placeholder initially)

---

### 2. `HeistCardSkeleton` component
**New files:**
- `components/HeistCardSkeleton/HeistCardSkeleton.tsx`
- `components/HeistCardSkeleton/HeistCardSkeleton.module.css`
- `components/HeistCardSkeleton/index.ts`

Mirrors `HeistCard` dimensions and border-radius (23px). Use a pulsing grey block for each content area via a CSS animation (`@keyframes pulse`). No props needed.

---

### 3. Update `/heists` page
**File:** `app/(dashboard)/heists/page.tsx`

**Changes:**
- Remove the `expired` heists section entirely — only render `active` and `assigned`
- Replace raw `<ul>/<li>` with a shared `<HeistGrid>` section pattern
- While `loading` is true for a section, render 6 `<HeistCardSkeleton />` in the grid
- When loaded and empty, show a short empty-state message per section
- Grid layout: 3-column on desktop, 2-column on tablet, 1-column on mobile

**Grid CSS** (inline in the page's module or via a utility in globals.css):
```css
.heistGrid {
  @apply grid gap-6;
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 480px) { grid-template-columns: 1fr; }
```

**Reuse:** `useHeists` hook is already written — call it twice (`"active"`, `"assigned"`), drop the `"expired"` call.

---

### 4. Stub `/heists/[id]` detail page
**File:** `app/(dashboard)/heists/[id]/page.tsx` — already exists as a placeholder. Verify it doesn't 404; no content changes needed.

---

### 5. Tests
**New file:** `tests/components/HeistCard.test.tsx`

Test cases (mirror existing Navbar.test.tsx patterns — mock `next/link`, `next/navigation`):
- Renders title, `assignedToCodename`, `createdByCodename`, formatted deadline
- Title is an `<a>` with `href="/heists/:id"`
- Renders gracefully when optional fields are missing/null

**New file:** `tests/components/HeistCardSkeleton.test.tsx`
- Renders without crashing

**New file:** `tests/components/HeistsPage.test.tsx`
- Shows skeletons while `useHeists` loading is true
- Hides expired section
- Shows empty-state message when no heists

Mock pattern to use (from Navbar test):
```ts
vi.mock("@/hooks/useHeists", () => ({ useHeists: () => mockUseHeists() }))
vi.mock("next/link", () => ({ default: ({ href, children }) => <a href={href}>{children}</a> }))
```

---

## Files to create / modify

| Action | Path |
|--------|------|
| Create | `components/HeistCard/HeistCard.tsx` |
| Create | `components/HeistCard/HeistCard.module.css` |
| Create | `components/HeistCard/index.ts` |
| Create | `components/HeistCardSkeleton/HeistCardSkeleton.tsx` |
| Create | `components/HeistCardSkeleton/HeistCardSkeleton.module.css` |
| Create | `components/HeistCardSkeleton/index.ts` |
| Modify | `app/(dashboard)/heists/page.tsx` |
| Verify | `app/(dashboard)/heists/[id]/page.tsx` (no changes needed) |
| Create | `tests/components/HeistCard.test.tsx` |
| Create | `tests/components/HeistCardSkeleton.test.tsx` |
| Create | `tests/components/HeistsPage.test.tsx` |

---

## Verification
1. `npm test` — all new and existing tests pass
2. `npm run dev` — visit `/heists`:
   - Skeletons appear briefly while loading
   - Cards render for active and assigned heists
   - No expired section visible
   - Clicking a card title navigates to `/heists/[id]` without 404
   - Grid is 3-col on desktop, 2-col on tablet, 1-col on mobile
3. `npm run lint` — no ESLint errors
