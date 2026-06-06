# Spec for auth-state-management

branch: claude/feature/auth-state-management  
figma_component (if used): N/A

## Summary
- Introduce a global auth state management solution using a React Context and a `useUser` hook.
- The context will hold a Firebase realtime listener that updates the current user whenever the auth state changes.
- Any component or page can call `useUser()` to get the current user object (or `null` if logged out).
- Update existing components that currently reference the user to use the new hook instead of any local workarounds.

## Functional Requirements
- A context provider (`AuthProvider`) must wrap the entire app so auth state is available globally.
- The provider must subscribe to Firebase's `onAuthStateChanged` listener on mount and unsubscribe on unmount.
- The context value must expose: `user` (Firebase `User` object or `null`) and `loading` (boolean indicating whether the initial auth check is complete).
- A `useUser` hook must be exported that returns the context value and throws a helpful error if used outside of `AuthProvider`.
- `loading` must be `true` until the first `onAuthStateChanged` callback fires, then `false` thereafter.
- No login, signup, or logout logic should be included in this feature.
- Existing components that access the current user must be updated to use `useUser` instead of their current approach.

## Figma Design Reference (only if referenced)
- N/A — this is a non-visual, state management feature.

## Possible Edge Cases
- The initial render before Firebase resolves the auth state (loading state must prevent premature redirects or blank UI).
- `useUser` called outside of `AuthProvider` should surface a clear error message.
- Firebase errors during the auth listener setup should be handled gracefully without crashing the app.
- Multiple components subscribing simultaneously — only a single listener should exist at the provider level.

## Acceptance Criteria
- `useUser()` returns `{ user: null, loading: false }` when no user is signed in (after initial check completes).
- `useUser()` returns `{ user: <FirebaseUser>, loading: false }` when a user is signed in.
- `loading` is `true` on first render and becomes `false` once the Firebase auth state is resolved.
- The hook is accessible from any page or component without prop drilling.
- Existing components previously using another user-access pattern have been migrated to `useUser`.
- Only one `onAuthStateChanged` listener is active at any given time.

## Open Questions
- Should `AuthProvider` live in the root layout (`app/layout.tsx`) or in a separate client wrapper component? yes, in root layout
- Do we need to expose a `setUser` or re-auth utility in the context for future use, or keep the context read-only for now? no, for now we will keep it read-only
- Should the `loading` state trigger a global loading spinner or be handled per-page? per-page

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- `useUser` returns `{ user: null, loading: true }` before Firebase resolves.
- `useUser` returns the correct user object after Firebase resolves with a signed-in user.
- `useUser` returns `{ user: null, loading: false }` after Firebase resolves with no signed-in user.
- Calling `useUser` outside of `AuthProvider` throws an appropriate error.
- The `onAuthStateChanged` listener is called on mount and cleaned up on unmount.
