# GameFlow

GameFlow is a gaming backlog and discovery app MVP built with Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Prisma, and PostgreSQL.

## Requirements

- Node.js 20+
- PostgreSQL
- One auth provider:
  - Google OAuth, or
  - Email magic links via SMTP

## Project Docs

The current source-of-truth product and engineering docs live in the repository root:

- `GAMEFLOW_PRD.md`
- `AGENTS.md`
- `MVP_SCOPE.md`
- `STACK_DECISIONS.md`
- `DATA_MODEL.md`
- `UI_GUIDELINES.md`
- `CODE_REVIEW_CHECKLIST.md`

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `DIRECT_URL`: direct PostgreSQL connection used for Prisma migrations and seeds on managed providers like Supabase
- `NEXTAUTH_URL`: app URL, `http://localhost:3000` locally
- `NEXTAUTH_SECRET`: long random secret used by NextAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: optional, required for Google sign-in
- `EMAIL_SERVER` / `EMAIL_FROM`: optional, required for email magic-link sign-in

At least one auth provider must be configured before deployment.
If you do not need magic-link auth, prefer Google-only sign-in and leave the email variables unset.

Supabase with Prisma:

```env
DATABASE_URL="postgresql://postgres.your-project-ref:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your-project-ref:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
```

Keep the existing Prisma client generator in `prisma/schema.prisma`. This project imports the generated client from `src/generated/prisma`, so replacing it with a default `prisma-client-js` generator snippet from Supabase setup guides will break the app.

## Analytics

GameFlow uses Vercel Web Analytics with lightweight custom events for core MVP flows:

- `sign_in`
- `backlog_game_added`
- `backlog_status_updated`
- `recommendations_viewed`
- `tonight_suggestions_viewed`

No additional environment variables are required for the default Vercel-hosted setup. Once the project is deployed on Vercel with Web Analytics enabled, page analytics and custom events will start flowing automatically.

## Setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run typecheck
npm run format
npm run prisma:generate
```

## Deployment

GameFlow is ready for Vercel deployment.

1. Create a PostgreSQL database for production.
2. Add all required environment variables in Vercel:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - provider variables for either Google or email auth
3. Ensure the production database has the latest Prisma migrations applied.
4. Deploy with Vercel. The build runs `prisma generate` automatically before `next build`.

Recommended pre-deploy checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment Notes

- Protected app routes require a valid NextAuth session.
- If no auth provider is configured, users will see a setup warning on the login page instead of a broken sign-in flow.
- Steam cover images are allowlisted in `next.config.ts` for optimized `next/image` loading in production.

## Structure

- `src/app` route entrypoints and layouts
- `src/components` reusable UI and presentation
- `src/features` feature composition
- `src/services` business logic
- `src/lib/db` database access
- `prisma` schema and migrations
