# Spec for route-protection

branch: claude/feature/route-protection

## Summary
- Protect route groups so that `(public)` pages are only accessible to unauthenticated users and `(dashboard)` pages are only accessible to authenticated users.
- Each group layout uses the `useUser` hook to determine auth status and redirects accordingly.
- A simple loading indicator is shown in each layout while Firebase resolves the auth state, preventing a flash of the wrong content.

## Functional Requirements
- The `(public)` group layout must redirect authenticated users away to `/heists` (or another appropriate dashboard route).
- The `(dashboard)` group layout must redirect unauthenticated users away to `/login`.
- Both layouts must display a loader while `useUser` is in its loading/pending state (i.e. Firebase has not yet confirmed or denied a session).
- Once auth status is resolved, the redirect (if applicable) must happen before the protected page content is rendered.
- The loader should be visually simple and centered — no complex animation required.
- No redirect should occur until Firebase has definitively resolved auth state; the loader bridges this gap.

## Possible Edge Cases
- Firebase takes longer than usual to resolve — the loader must remain visible until resolution, not time out.
- User navigates directly to a dashboard URL while unauthenticated — must redirect to `/login`.
- User navigates directly to a public URL (e.g. `/login`) while already authenticated — must redirect to `/heists`.
- Auth state changes mid-session (e.g. another tab logs out) — the layout should react to the new state.
- Both layouts must handle the case where `useUser` returns `null` user vs. a defined user correctly.

## Acceptance Criteria
- An authenticated user visiting `/login` or `/signup` is redirected to `/heists`.
- An unauthenticated user visiting any `(dashboard)` route is redirected to `/login`.
- A loader is visible in both layouts while auth state is pending.
- No protected page content is rendered before auth state is resolved.
- The loader disappears and content (or redirect) appears as soon as auth state is known.

## Open Questions
- Should the loader be a shared component, or inlined separately in each layout? shared component
- Is there a preferred redirect target for authenticated users on public pages other than `/heists`? no

## Testing Guidelines
Create test file(s) in `./tests` for the relevant layout components and cover the following cases, without going too heavy:
- `(public)` layout renders a loader while auth state is pending.
- `(public)` layout redirects to `/heists` when user is authenticated.
- `(public)` layout renders children when user is unauthenticated.
- `(dashboard)` layout renders a loader while auth state is pending.
- `(dashboard)` layout redirects to `/login` when user is unauthenticated.
- `(dashboard)` layout renders children when user is authenticated.
