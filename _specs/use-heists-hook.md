# Spec for useHeists Hook

branch: claude/feature/use-heists-hook

## Summary
- Create a `useHeists` custom React hook that subscribes to real-time Firestore data from the heists collection.
- The hook accepts a filter argument (`'active'`, `'assigned'`, or `'expired'`) and returns the appropriate subset of heists.
- Use the hook in `app/(dashboard)/heists/page.tsx` to display titles for all three result sets.

## Functional Requirements
- The hook must be named `useHeists` and accept a single string argument: `'active'`, `'assigned'`, or `'expired'`.
- The hook must use a Firestore real-time listener (onSnapshot) so data updates automatically without manual refresh.
- The hook must return an array of heist objects.
- Query behavior by filter type:
  - `'active'`: heists where the current user is in the assigned-to list AND the deadline has not passed.
  - `'assigned'`: heists where the current user is the assigner/creator AND the deadline has not passed.
  - `'expired'`: heists where the deadline has passed AND `finalStatus` is not null, regardless of which user is involved.
- The hook must read the currently authenticated user from the auth context (or Firebase Auth) to filter by user.
- The hook should clean up the Firestore listener on unmount.
- The hook should handle loading and error states.

## Possible Edge Cases
- User is not authenticated — hook should return an empty array and not attempt Firestore queries.
- Firestore listener fails — hook should surface an error state rather than silently failing.
- A heist's deadline is exactly the current time — treat as expired (deadline has passed).
- `finalStatus` field may be absent on some documents — treat missing `finalStatus` as null for the `'expired'` filter.
- The filter argument changes at runtime — hook should re-subscribe with the new query.

## Acceptance Criteria
- `useHeists('active')` returns heists where the logged-in user is assigned and deadline > now.
- `useHeists('assigned')` returns heists where the logged-in user is the creator and deadline > now.
- `useHeists('expired')` returns heists where deadline <= now and finalStatus is not null.
- All three results update in real time when Firestore data changes.
- `app/(dashboard)/heists/page.tsx` renders only the title of each heist under three labeled sections: "Your Active Heists", "Heists You've Assigned", and "All Expired Heists".
- The page renders correctly with an empty array for any section.

## Open Questions
- What is the exact Firestore collection name for heists? heists
- What field name stores the assigned-to user (e.g. `assignedTo`, `members`)?assignedTo
- What field name stores the assigner/creator (e.g. `createdBy`, `assignedBy`)?createdBy and createdByCodename
- Is the deadline stored as a Firestore Timestamp or a string?timestamp
- What are the possible values for `finalStatus`?im not sure yet

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Returns an empty array when the user is not authenticated.
- Calls onSnapshot with the correct Firestore query for each filter type (`'active'`, `'assigned'`, `'expired'`).
- Returns the array of heists provided by the Firestore snapshot.
- Cleans up the Firestore listener on unmount.
- Updates the returned array when the Firestore snapshot emits new data.
