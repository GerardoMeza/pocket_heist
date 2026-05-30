---
description: Create a commit message by analyzing code changes
allowed-tools: Bash(git status:*, git diff --staged, git commit:*)
---

## Context:

- Current git status: !`git status` 
- Current git diff: !`git diff --staged`

## Your task:
Analyzed above staged git changes and create a concise commit message that accurately describes the purpose of the changes. The commit message should be clear, informative, and follow best practices for writing commit messages.

## Commit types with emojis:
Only use the following commit types with their corresponding emojis:
- feat: ✨ (A new feature)
- fix: 🐛 (A bug fix)
- docs: 📚 (Documentation changes)
- style: 🎨 (Code style changes, formatting, etc.)
- refactor: 🔨 (Code refactoring without changing functionality)
- test: ✅ (Adding or updating tests)
- chore: 🔧 (Maintenance tasks, build scripts, etc.)
- perf: 🚀 (Performance improvements)  

## Format:
<emoji> <type>: <subject>

## Output:
- Use the appropriate emoji and type based on the changes made.
- Write a concise subject that summarizes the changes in 50 characters or less.
- Do not include a body or footer in the commit message.
- Ask for confirmation if the generated commit message accurately reflects the changes made.
- Show summary of changes if needed to help generate the commit message.

Do not auto commit. Wait for user confirmation before finalizing the commit message.

