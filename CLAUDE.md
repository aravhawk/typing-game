# CLAUDE.md - AI Assistant Guide

This document provides a comprehensive guide to the codebase for AI assistants working on the anytype typing game project.

## Project Overview

**anytype** is a minimal typing test game built with modern web technologies. It features real-time WPM tracking, leaderboards, race mode with ghost cursors, shareable results, and Google OAuth authentication.

## Tech Stack

- **Next.js 16** (App Router) - React framework with server/client components
- **React 19** - UI library with JSX transform
- **TypeScript 5** - Type safety with strict mode enabled
- **Drizzle ORM** - Type-safe PostgreSQL database queries
- **Better Auth** - Authentication library with Google OAuth
- **PostgreSQL** - Primary database (configured for Neon)
- **Tailwind CSS 4** - Utility-first styling with @tailwindcss/postcss
- **Recharts** - WPM history visualization
- **Howler.js** - Keyboard sound effects engine
- **Sonner** - Toast notifications
- **Next Themes** - Dark/light theme support
- **Nanoid** - Short ID generation for shareable links

## Directory Structure

```
typing-game/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   ├── share.ts              # Share game results
│   │   └── timer-preference.ts   # Timer preference management
│   ├── api/                      # API Routes
│   │   ├── auth/[...all]/        # Better Auth catch-all route
│   │   └── leaderboard/          # Leaderboard endpoints
│   ├── leaderboard/              # Leaderboard page
│   ├── profile/                  # User profile page
│   ├── s/[shortId]/              # Shareable results page
│   ├── layout.tsx                # Root layout with theme provider
│   ├── page.tsx                  # Home page (typing game)
│   ├── globals.css               # Global styles
│   └── opengraph-image.tsx       # OG image generator
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── typing-game.tsx           # Main game component
│   ├── results-view.tsx          # Game results display
│   ├── wpm-chart.tsx             # WPM history chart
│   ├── wpm-chart-wrapper.tsx     # Chart server wrapper
│   ├── navigation.tsx            # Top navigation
│   ├── bottom-nav.tsx            # Bottom navigation
│   ├── back-button.tsx           # Back button component
│   └── theme-provider.tsx        # Next Themes wrapper
├── lib/                          # Shared utilities
│   ├── db/                       # Database
│   │   ├── index.ts              # Drizzle client
│   │   └── schema.ts             # Database schema
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth client
│   ├── auth-server.ts            # Session utilities
│   ├── excerpts.ts               # Text excerpts for typing
│   ├── use-keyboard-sounds.ts    # Keyboard sounds hook
│   └── utils.ts                  # Shared utilities (cn, etc.)
├── public/                       # Static assets
│   ├── fonts/                    # CursorGothic font files
│   └── sounds/                   # Keyboard sound effects
│       ├── press/                # Key press sounds
│       └── release/              # Key release sounds
├── drizzle/                      # Database migrations
├── drizzle.config.ts             # Drizzle ORM config
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── components.json               # shadcn/ui config
├── eslint.config.mjs             # ESLint config
├── postcss.config.mjs            # PostCSS config
└── package.json                  # Dependencies and scripts
```

## Database Schema

### Better Auth Tables (Auto-managed)

- **user** - User accounts with Google OAuth
  - `id` (text, PK)
  - `name`, `email`, `emailVerified`, `image`
  - `timerDuration` (15 or 30 seconds, default: 30)
  - `createdAt`, `updatedAt`

- **session** - User sessions
  - `id`, `token`, `expiresAt`
  - `userId` (FK to user)
  - Session metadata (IP, user agent)

- **account** - OAuth provider accounts
  - `accountId`, `providerId`
  - `userId` (FK to user)
  - OAuth tokens and metadata

- **verification** - Email verification tokens

### Application Tables

- **gameResults** - Game completion records
  - `id` (nanoid)
  - `userId` (FK to user, nullable for anonymous)
  - `wpm`, `accuracy`, `duration`
  - `textExcerpt`
  - `wpmHistory` (JSONB array of {time, wpm})
  - `createdAt`
  - Constraints: wpm (0-350), accuracy (0-100), duration (0-300)

- **shareableResults** - Maps short IDs to game results
  - `id` (nanoid)
  - `shortId` (unique, used in URLs)
  - `gameResultId` (FK to gameResults)
  - `createdAt`

## Key Patterns and Conventions

### TypeScript Configuration

- **Strict mode enabled** - All code must pass strict TypeScript checks
- **Path alias**: `@/*` maps to project root
- **Target**: ES2017 with modern library features
- **JSX**: react-jsx transform (no React import needed)
- **Module resolution**: bundler

### Next.js App Router Patterns

1. **Server vs Client Components**
   - Default to Server Components for data fetching and static content
   - Use `"use client"` directive only when needed (state, effects, browser APIs)
   - Examples: `typing-game.tsx`, `theme-provider.tsx` are client components

2. **Server Actions**
   - Located in `app/actions/`
   - Use `"use server"` directive
   - Pattern: async functions that can be called from client components
   - Examples: `shareGameResult()`, `getTimerPreference()`, `setTimerPreference()`

3. **API Routes**
   - Located in `app/api/`
   - Use Next.js Route Handlers (not Pages Router API routes)
   - Export named functions: `GET`, `POST`, etc.
   - Return `Response` or use `NextResponse`

4. **Metadata and OG Images**
   - Export `metadata` object for static metadata
   - Use `opengraph-image.tsx` for dynamic OG images
   - Follows Next.js metadata API conventions

### Authentication

- **Better Auth** handles all authentication logic
- **Google OAuth only** - email/password disabled
- Catch-all route: `app/api/auth/[...all]/route.ts`
- Client usage: `import { authClient } from "@/lib/auth-client"`
- Server usage: `import { getSession } from "@/lib/auth-server"`
- Session type: `import type { Session } from "@/lib/auth"`

### Database Operations

- **Drizzle ORM** for all database queries
- Import client: `import { db } from "@/lib/db"`
- Import schema: `import { user, gameResults, etc. } from "@/lib/db/schema"`
- Use `.insert()`, `.select()`, `.update()`, `.delete()` builders
- Leverage TypeScript types from schema

### Styling

- **Tailwind CSS 4** with @tailwindcss/postcss
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Custom font: CursorGothic loaded via `next/font/local`
- CSS variable: `var(--font-cursor-sans)`
- Theme support: `dark:` prefix for dark mode styles
- Animation: `tw-animate-css` package for animations

### Component Patterns

1. **shadcn/ui components** in `components/ui/`
   - Pre-built, customizable components
   - Use as foundation for custom components

2. **Custom hooks**
   - `useKeyboardSounds()` - Keyboard sound effects
   - `useToast()` - Toast notifications (from shadcn/ui)

3. **State management**
   - React useState for local state
   - No global state management (no Redux, Zustand, etc.)
   - Server state via Server Components and Actions

## Development Workflows

### Package Management

- **Use pnpm** as the primary package manager
- Lock files: Both `pnpm-lock.yaml` and `package-lock.json` exist
- Install: `pnpm install`
- Add dependency: `pnpm add <package>`
- Add dev dependency: `pnpm add -D <package>`

### Available Scripts

```bash
pnpm dev         # Start development server (localhost:3000)
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
pnpm db:generate # Generate Drizzle migrations
pnpm db:migrate  # Apply database migrations
pnpm db:push     # Push schema changes (dev only, skips migrations)
pnpm db:studio   # Open Drizzle Studio (database GUI)
```

### Database Workflow

1. **Schema changes**: Edit `lib/db/schema.ts`
2. **Generate migration**: `pnpm db:generate`
3. **Review migration**: Check `drizzle/` folder
4. **Apply migration**: `pnpm db:migrate`
5. **Alternative (dev only)**: `pnpm db:push` (no migration files)

### Environment Variables

Required in `.env.local`:

```env
DATABASE_URL="postgresql://..."           # PostgreSQL connection string
GOOGLE_CLIENT_ID="..."                    # Google OAuth client ID
GOOGLE_CLIENT_SECRET="..."                # Google OAuth client secret
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Base URL for absolute URLs
BETTER_AUTH_SECRET="..."                  # Auth secret (generate random)
BETTER_AUTH_URL="http://localhost:3000"   # Auth callback URL
```

### Git Workflow

- Main branch: `main` (not specified, assume standard)
- Feature branches: Follow Claude Code branch naming (`claude/...`)
- Commit messages: Concise, descriptive, follow conventional style
- `.gitignore`: Standard Next.js ignore patterns + `.env*` files

## Game Mechanics and Logic

### Typing Game Flow

1. **Initialization**: Random text excerpt loaded on mount
2. **Start**: Timer begins on first keystroke
3. **Live tracking**: WPM updates every 100ms during active game
4. **Completion**: Game ends when timer expires OR text is finished
5. **Results**: Final WPM, accuracy, and WPM history calculated

### WPM Calculation

```
WPM = (correct characters / 5) / minutes elapsed
```

- Correct characters: Characters that match the excerpt at their position
- Standard word length: 5 characters
- Updates in real-time during gameplay

### Accuracy Calculation

```
Accuracy = (correct characters / total typed) * 100
```

### Race Mode

- Select opponent from leaderboard
- Ghost cursor shows opponent's progress based on their WPM
- Ghost position updates in real-time to match opponent's speed
- Visual indicator of performance comparison

### Share Functionality

1. Generate unique `shortId` using nanoid
2. Save game result to database
3. Create shareable link: `/s/[shortId]`
4. Auto-generate OG image for social sharing
5. Copy link to clipboard with toast notification

## Code Quality Guidelines

### TypeScript

- **Always use types** - No `any` unless absolutely necessary
- **Interface vs Type**: Prefer `interface` for object shapes, `type` for unions/intersections
- **Null safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **Enums vs Union Types**: Prefer union types over enums

### React Best Practices

- **Hooks**: Only call at top level, not in conditions/loops
- **useEffect dependencies**: Always include all dependencies
- **Memoization**: Use `useCallback` and `useMemo` for expensive operations
- **Refs**: Use `useRef` for DOM access and mutable values that don't trigger re-renders

### Performance

- **Server Components by default** - Only use client components when necessary
- **Dynamic imports**: Use `next/dynamic` for heavy client components
- **Image optimization**: Use `next/image` for all images
- **Font loading**: Use `next/font` for web font optimization

### Accessibility

- **Semantic HTML**: Use appropriate HTML elements
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **ARIA labels**: Add where needed for screen readers
- **Focus management**: Maintain logical focus order

## Common Tasks for AI Assistants

### Adding a New Feature

1. Identify if it requires client or server logic
2. Create necessary components in `components/`
3. Add server actions in `app/actions/` if needed
4. Update database schema if persistence required
5. Generate and apply migrations
6. Update types and interfaces
7. Test thoroughly

### Modifying Database Schema

1. Edit `lib/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Review migration in `drizzle/` folder
4. Run `pnpm db:migrate` to apply
5. Update affected queries and types

### Adding a New Page

1. Create folder in `app/` with `page.tsx`
2. Export default component
3. Add metadata export if needed
4. Add to navigation if applicable
5. Create OG image generator if needed (`opengraph-image.tsx`)

### Adding an API Endpoint

1. Create route in `app/api/[endpoint]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use Drizzle for database queries
4. Handle authentication with `getSession()` if needed
5. Return proper Response objects with status codes

### Styling Components

1. Use Tailwind utility classes
2. Leverage `cn()` for conditional classes
3. Use CSS variables for theme-aware colors
4. Add dark mode variants with `dark:` prefix
5. Ensure responsive design with breakpoint prefixes (`sm:`, `md:`, etc.)

## Testing and Debugging

### Development Server

- Run `pnpm dev` for hot reload
- Check terminal for compilation errors
- Check browser console for runtime errors
- Use React DevTools for component inspection

### Database Debugging

- Use `pnpm db:studio` to inspect database visually
- Check migration files in `drizzle/` for schema changes
- Verify constraints in schema match database state

### Common Issues

1. **Hydration errors**: Ensure server and client render the same initial output
   - Use `useEffect` or `useLayoutEffect` for client-only logic
   - Set initial state that matches server render

2. **Auth issues**: Verify environment variables are set
   - Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - Ensure callback URLs match in Google Console

3. **Database connection**: Verify `DATABASE_URL` is correct
   - Test connection with `pnpm db:studio`
   - Check PostgreSQL server is running

## Additional Notes

### Font System

- Custom font: CursorGothic (Regular, Italic, Bold, Bold Italic)
- Located in `public/fonts/`
- Loaded in `app/layout.tsx` via `next/font/local`
- Applied via CSS variable `--font-cursor-sans`

### Sound System

- Keyboard sounds in `public/sounds/press/` and `public/sounds/release/`
- Managed by `useKeyboardSounds()` hook
- Uses Howler.js for audio playback
- Toggleable per user preference (not persisted)

### Text Excerpts

- Stored in `lib/excerpts.ts`
- Function: `getRandomExcerpt()`
- Returns random text for typing test
- Can be extended with more excerpts

### Leaderboard

- Top 10 players by WPM
- Includes player name, WPM, accuracy, duration
- Accessible via `/api/leaderboard` and `/api/leaderboard/top`
- Displayed on `/leaderboard` page

### User Profiles

- Accessible at `/profile`
- Shows user stats: best WPM, average WPM, games played
- Displays WPM history chart
- Lists recent game results

## Version Information

- Next.js: 16.0.0
- React: 19.2.0
- TypeScript: 5.x
- Node.js requirement: 20+
- Tailwind CSS: 4.x

---

**Last Updated**: 2025-11-19

This guide should be updated whenever significant architectural changes are made to the project.
