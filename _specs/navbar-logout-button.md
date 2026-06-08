# Spec for navbar-logout-button

branch: claude/feature/navbar-logout-button  
figma_component (if used): PRIMARY BUTTON (node 164:1354)

## Summary
- Add a logout button to the `Navbar` component that signs the user out of Firebase Auth when clicked.
- The button is only visible when the user is authenticated (i.e. `useUser` returns a non-null user).
- No redirect is required after logout — the auth state change will propagate through the existing `AuthProvider`.

## Functional Requirements
- The `Navbar` must import and call `useUser` to determine if a user is currently logged in.
- A "Log out" button must be rendered inside `Navbar` only when `user` is non-null.
- Clicking the button must call Firebase Auth's `signOut` method.
- No redirect should occur after sign-out — rely on the `AuthProvider` to update global auth state.
- The button must be visually distinct as a primary action (see Figma Design Reference below).

## Figma Design Reference
- File: FIGMA CLASS FILE - BOBA TEA
- Node: `164:1354` — **PRIMARY BUTTON**
- Key visual constraints:
  - Background color: `#FF0076` (hot pink / primary action color)
  - Border radius: fully rounded (`border-radius: 100px`)
  - Text: white, Roboto SemiBold, 19px, uppercase, letter-spacing `-0.38px`
  - Label: use "LOG OUT" (matching the uppercase style from Figma)
- Map `#FF0076` to the closest existing design token in `globals.css` (e.g. `text-primary` or a custom `bg-primary` token); if none exists, use the hex value directly until a token is defined.

## Possible Edge Cases
- `signOut` throws an error — show or log the error gracefully; do not leave the UI in a broken state.
- User clicks the button multiple times quickly — disable the button while sign-out is in flight to prevent duplicate calls.
- `useUser` returns `undefined` briefly during auth initialization — button should not flash visible; treat `undefined` the same as `null` (not logged in).

## Acceptance Criteria
- The logout button is visible in the `Navbar` when a user is signed in.
- The logout button is not rendered when no user is signed in.
- Clicking the button calls `signOut` from Firebase Auth.
- After sign-out, the button disappears (auth state updates via `AuthProvider`).
- The button matches the primary button style from Figma (pink background, white uppercase label, fully rounded).

## Open Questions
- Should the button show a loading/disabled state while sign-out is in progress? no
- Is "LOG OUT" the correct label, or should it be "Sign out" to match other copy in the app? Log Out

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Logout button is rendered when a logged-in user is present via `useUser`.
- Logout button is NOT rendered when `useUser` returns `null`.
- Clicking the logout button calls `signOut`.
- Button is disabled while sign-out is in flight (if loading state is implemented).
