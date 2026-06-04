# Spec for auth-login-signup-forms

branch: claude/feature/auth-login-signup-forms  
figma_component (if used): N/A

## Summary
- Add email/password forms to the `/login` and `/signup` pages
- Each form has a show/hide password toggle icon and a submit button
- On submission, form data is logged to the console (no real auth yet)
- Users can easily switch between the login and signup forms via a link

## Functional Requirements
- `/login` page renders a form with an email field, a password field, and a "Log in" button
- `/signup` page renders a form with an email field, a password field, and a "Sign up" button
- Both password fields have a toggle icon to show or hide the password value
- Submitting either form logs `{ email, password }` to the browser console
- The login page includes a link to `/signup` ("Don't have an account? Sign up")
- The signup page includes a link to `/login` ("Already have an account? Log in")
- Both forms are visually consistent and centered, matching the existing public layout

## Figma Design Reference (only if referenced)
- N/A

## Possible Edge Cases
- User submits the form with empty fields — browser native validation should prevent it (both fields are required)
- Password field toggle should not trigger form submission
- Navigating between `/login` and `/signup` should reset form state (no carry-over values)

## Acceptance Criteria
- Visiting `/login` shows a functional email + password form with a "Log in" button
- Visiting `/signup` shows a functional email + password form with a "Sign up" button
- Clicking the password toggle icon switches the field between hidden and visible text
- Submitting the login form logs credentials to the console
- Submitting the signup form logs credentials to the console
- Each page has a clearly visible link to switch to the other form

## Open Questions
- Should the forms share a single reusable `AuthForm` component, or be implemented independently per page? use a reusable component to avoid duplication and ensure consistency
- Should there be any client-side validation beyond browser-native required field enforcement? No.

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Renders email and password fields
- Renders the correct submit button label ("Log in" / "Sign up")
- Password field is hidden by default; toggle makes it visible
- Submitting the form calls console.log with the correct email and password values
- The switch link points to the correct route (`/signup` from login, `/login` from signup)
