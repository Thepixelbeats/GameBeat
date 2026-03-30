# GameFlow AI Rules

## Product

GameFlow is a gaming backlog and discovery app.

## MVP goals

- track games
- manage backlog
- search and discover games
- get recommendations
- get a "What Should I Play Tonight" suggestion
- view gaming stats

## Non-goals

Do not implement:

- social feed
- chat
- friends
- marketplace
- native iOS or Android apps
- advanced AI pipelines
- billing
- achievements syncing
- multi-platform account sync beyond future roadmap placeholders

## Architecture rules

1. Never put business logic inside UI components.
2. All business logic goes into `services/`.
3. All database access goes through `lib/db/`.
4. All input validation must use schemas.
5. Prefer server actions for simple CRUD.
6. External API integrations belong in `services/`.
7. Reuse components. Do not duplicate UI logic.
8. Keep the code simple and strongly typed.
9. Stay inside MVP scope.
10. Do not perform large refactors unless explicitly asked.

## Engineering rules

- Use TypeScript strict mode.
- Prefer readable code over clever code.
- Add loading, empty, and error states.
- Keep functions small.
- Keep feature folders cohesive.
- Add comments only where they improve clarity.
- Do not introduce heavy dependencies unless necessary.

## UI rules

- dark-first theme
- clean gaming aesthetic
- responsive layout
- minimal clutter
- strong hierarchy
- large covers/cards where useful
- keep forms short and obvious

## Folder structure

Use this structure:

src/
app/
dashboard/
backlog/
discover/
tonight/
stats/
settings/
components/
ui/
layout/
shared/
game/
features/
auth/
backlog/
games/
dashboard/
recommendations/
stats/
tonight/
services/
backlog/
games/
recommendations/
stats/
tonight/
lib/
db/
auth/
validations/
utils/
types/
prisma/

## Data access rule

Never query Prisma directly from React components.
