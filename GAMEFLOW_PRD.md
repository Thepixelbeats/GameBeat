# GameFlow – Product Requirements & Engineering Architecture

Version: 1.0

## 1. Product vision

GameFlow helps gamers organize and understand their gaming life.

Core value:

- track games
- manage backlog
- discover new games
- analyze gaming habits
- decide what to play next

Mission:
Remove decision fatigue for gamers.

## 2. Problem statement

Modern gamers often have:

- large libraries
- limited time
- difficulty deciding what to play next
- scattered gaming decisions

GameFlow creates a single hub for gaming decisions.

## 3. Core user personas

### Casual Explorer

Plays occasionally and wants suggestions.

### Backlog Collector

Owns many games but struggles to finish them.

### Completionist

Tracks finished games and completion statistics.

## 4. Product goals

Primary goals:

- simplify backlog management
- help users choose games faster
- provide insight into gaming behavior

Success signals:

- user adds at least 5 games
- user uses Tonight Suggestion
- user revisits dashboard

## 5. MVP feature set

Version 1 includes:

1. Authentication
2. Game search
3. Backlog manager
4. Dashboard
5. Recommendations
6. What Should I Play Tonight
7. Gaming statistics

Excluded from v1:

- social features
- friends
- chat
- marketplace
- native mobile apps
- advanced AI systems

## 6. Technology stack

Frontend:

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui

Backend:

- Next.js Server Actions
- Prisma ORM
- PostgreSQL

Auth:

- NextAuth or Supabase Auth

Deployment:

- Vercel

## 7. System architecture

Monolithic web app.

Flow:
User -> UI -> Server Action / Route Handler -> Service Layer -> Database / External API

## 8. Main routes

- /dashboard
- /backlog
- /discover
- /tonight
- /stats
- /settings

## 9. Data model

### User

- id
- email
- name
- image
- createdAt
- updatedAt

### Game

- id
- externalId
- title
- slug
- coverUrl
- releaseDate
- genres
- platforms
- rating
- createdAt
- updatedAt

### UserGameEntry

- id
- userId
- gameId
- status
- userRating
- notes
- priority
- addedAt
- updatedAt

Statuses:

- BACKLOG
- PLAYING
- COMPLETED
- DROPPED
- WISHLIST

## 10. Core modules

### Dashboard

Shows:

- backlog count
- playing count
- completed count
- wishlist count
- recently added
- tonight suggestion

### Backlog

Allows:

- add game
- update status
- rate game
- add notes
- set priority
- remove game

### Discover

Allows:

- search games
- browse recommendations
- add to backlog

### Tonight

Allows:

- pick session length
- pick mood
- choose solo or multiplayer
- get 3 suggestions

### Stats

Shows:

- gaming DNA
- genre distribution
- completion rate
- backlog hours estimate

## 11. Recommendation engine

Use deterministic scoring in v1.

Inputs:

- completed games
- highly rated games
- inferred favorite genres

Scoring factors:

- genre similarity
- popularity score
- overlap with user preferences

Output:

- top 10 recommended games
- short explanation for each

## 12. What Should I Play Tonight

Inputs:

- session length
- mood
- solo or multiplayer

Algorithm:

1. filter user backlog
2. exclude games that do not fit the session
3. prioritize highly rated / high priority entries
4. return 3 suggestions with short reasons

## 13. UI principles

- dark theme
- large game covers
- clean dashboard
- minimal text
- fast interactions

## 14. Engineering rules

- strongly typed TypeScript
- simple architecture
- no overengineering
- reusable UI
- loading, empty, and error states required

## 15. Future roadmap (not in v1)

- Steam import
- PlayStation integration
- Xbox integration
- mobile apps
- social features
