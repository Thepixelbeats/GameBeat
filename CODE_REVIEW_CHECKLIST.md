# Code Review Checklist

After each Codex task, review for:

## Scope

- Did it stay inside MVP scope?
- Did it avoid adding speculative features?

## Architecture

- Is business logic outside UI?
- Is DB access outside components?
- Are external API calls in services?

## Code quality

- Is TypeScript strict and clean?
- Are names clear?
- Is code duplicated?
- Is complexity justified?

## UX

- Is there a loading state?
- Is there an empty state?
- Is there an error state?
- Is the UI consistent with GameFlow style?

## Product

- Does this actually help the user?
- Is the flow simple?
- Is anything unnecessarily complicated?

## Final pass prompt

Use this with Codex:

Review your implementation as a senior engineer.

Check for:

- unnecessary complexity
- type safety issues
- repeated code
- missing loading, empty, or error states
- deviations from GAMEFLOW_PRD.md and AGENTS.md

Then fix the issues you find.
