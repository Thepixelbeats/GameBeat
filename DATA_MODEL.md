# Data Model

## Entities

### User

- id: string
- email: string
- name: string | null
- image: string | null
- createdAt: DateTime
- updatedAt: DateTime

### Game

- id: string
- externalId: string
- title: string
- slug: string | null
- coverUrl: string | null
- releaseDate: DateTime | null
- genres: string[]
- platforms: string[]
- rating: float | null
- createdAt: DateTime
- updatedAt: DateTime

### UserGameEntry

- id: string
- userId: string
- gameId: string
- status: enum
- userRating: int | null
- notes: string | null
- priority: int | null
- addedAt: DateTime
- updatedAt: DateTime

## Status enum

- BACKLOG
- PLAYING
- COMPLETED
- DROPPED
- WISHLIST

## Rules

- A user can have only one entry per game.
- A game can exist without being in any user backlog.
- Notes are optional.
- Priority is optional.
- Ratings are user-specific.
