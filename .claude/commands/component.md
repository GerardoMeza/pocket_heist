---
description: Create a UI component using TDD approach (test-driven development)
allowed-tools: Read, Write, Edit, Glob, Bash(npm test:*), Bash(npx vitest:*)
argument-hint: "[brief component description]"
---

## User Input:
The user will provide a description of the UI component they want to create to make: **$ARGUMENTS**

## Do this first:
From the component information, determine a pascalcase component name (e.g., "a card component" -> "Card").

### 1. Write tests first:
Create `test/components/ComponentName.test.tsx` with basic tests for the component's expected behavior and appearance.

Pattern:
```tsx
import { render, screen } from "@testing-library/react"
import ComponentName from "@/components/ComponentName"
import { describe, it, expect } from "vitest"

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />)
    // Add assertions to verify the component's behavior and appearance
  })
})
```

### 2. Run tests: (expect failure)
```bash
npm test test/components/ComponentName.test.tsx
```

### 3. Create Component:
- `components/ComponentName/ComponentName.tsx` with the component implementation.
- `components/ComponentName/ComponentName.module.css` with the component's styles.
- `components/ComponentName/index.ts` to export the component.

Conventions: no semicolons, use CSS modules for styling, and follow the file structure outlined above.

### 4. Run tests again: (expect success)
```bash 
npm test test/components/ComponentName.test.tsx
```
Iterate on the component implementation until all tests pass successfully.

### 5. Add to Preview Page:
Add the new component to `app/(public)/preview/page.tsx` to visually verify its appearance and behavior.

## Rules:
- Follow the TDD approach strictly: write tests first, then implement the component, and finally verify with tests.
- Keep test minimal.
- Only proceed when current step passes.


