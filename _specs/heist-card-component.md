# Spec for Heist Card Component

branch: claude/feature/heist-card-component  
figma_component: HeistCard (node-id=1-30)

## Summary
- Display heist cards on the `/heists` page for active and assigned heists only (not expired)
- Each card links to the heist detail page (`/heists/:id`) via the title
- Cards are displayed in a 3-column responsive grid
- A skeleton version of the card is shown in the same layout while data is loading

## Functional Requirements
- Fetch heists from Firestore using the existing `useHeists` hook
- Filter to show only heists with status `active` or `assigned`; exclude `expired` heists
- Render a `HeistCard` component for each qualifying heist
- The heist title is a link that navigates to `/heists/[id]` (detail page — no content needed yet)
- Display the `/heists` page in a 3-column grid layout
- Show `HeistCardSkeleton` components in the same grid while heists are loading
- Number of skeleton cards shown during loading: 6

## Figma Design Reference
- File: Cards — Website UI Cards (Community)
- Component name: HeistCard
- Node: `1-30`
- Link: https://www.figma.com/design/kwqEWCyT6ABT5piNM4blZm/Cards---Website-UI-Cards--Community-?node-id=1-30

### Key Visual Constraints
- **Dimensions:** ~520px wide × ~348px tall
- **Border radius:** 23px
- **Background:** Gradient at 58.4° from `#f6d465` (yellow) to `#fff` (white)
- **Padding:** 28px vertical, 21px horizontal; 24px gap between sections; 8px between metadata rows
- **Shadow:** None
- **Overflow:** Clipped

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Inter | 20px | Medium | White |
| Metadata labels | Inter | 14px | Regular | `#99a1af` (gray) |
| Target user | Inter | 14px | Regular | `#c27aff` (purple) |
| Assigned by | Inter | 14px | Regular | `#fb64b6` (pink) |
| Duration | Inter | 14px | Regular | `#c27aff` (purple) |

### Content Structure
1. Decorative illustration (top of card, uses `mix-blend-multiply`)
2. Title (links to detail page)
3. Metadata rows:
   - **To:** target user (with person icon)
   - **By:** assigned-by user (with person icon)
   - **Date/time + duration** (with calendar/clock icon)

### Icons
- Person icon (12px) before "To:" and "By:" labels
- Calendar/clock icon (12px) before timestamp
- Alert/notification circle icon (16px) in top-right corner

## Possible Edge Cases
- No active or assigned heists — show an empty state message
- Heist title is very long — truncate with ellipsis
- Missing `targetUser` or `createdBy` fields — render gracefully without crashing
- Loading state persists longer than expected — skeleton should not flicker

## Acceptance Criteria
- `/heists` page renders cards only for heists with status `active` or `assigned`
- Heist cards with status `expired` are not shown
- Clicking the card title navigates to `/heists/[id]`
- The detail page at `/heists/[id]` exists (as an empty route) and does not 404
- Cards are displayed in a 3-column grid on desktop
- While loading, 6 skeleton cards are shown in the same 3-column grid
- Skeletons match the card dimensions and border radius

## Open Questions
- Should the grid be responsive (e.g. 1-column on mobile, 2-column on tablet)? yes responsive
- Should the decorative illustration vary per card or be static? static for now
- Are `active` and `assigned` the exact Firestore status field values? yes
- Who are "To" and "By" fields mapped to in the Firestore heist document?assignedToCodename and createdByCodename 

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `HeistCard` renders title, target user, assigned-by user, and date metadata
- `HeistCard` title is a link pointing to `/heists/:id`
- `/heists` page filters out heists with status `expired`
- `/heists` page shows skeletons while loading
- `HeistCard` renders gracefully when optional fields are missing
