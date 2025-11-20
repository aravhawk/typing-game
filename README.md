# anytype

A minimal typing test game built with Next.js, featuring real-time WPM tracking, leaderboards, and shareable results.

## Features

- **AI-generated typing paragraphs** using GPT-4.1-nano for signed-in users (anonymous users get curated excerpts)
- **15s or 30s typing tests** with timer preference saved for logged-in users
- **Real-time WPM tracking** with live updates every 100ms
- **WPM history charts** showing performance over time
- **Race mode** with ghost cursor to compete against any player from the leaderboard
- **Toggleable keyboard sound effects** using Howler.js
- **Leaderboard** displaying top 10 players by WPM
- **User profiles** with best WPM, average WPM, and game history
- **Shareable results** with unique short URLs and OpenGraph images
- **Google OAuth authentication** via Better Auth
- **Dark/Light theme support** with system preference detection
- **Custom font** (CursorGothic) for enhanced typography
- **Animated cursor** with smooth transitions during typing
- **Game completion** by timer expiration or finishing the text excerpt

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables in `.env.local`:

```env
DATABASE_URL="your-postgres-connection-string"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"  # Required for AI paragraph generation
```

3. Generate and run database migrations:

```bash
# Generate Better Auth schema (if needed)
npx @better-auth/cli generate

# Generate Drizzle migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Or push schema directly (development)
pnpm db:push
```

4. Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to start typing.

## Tech Stack

- **Next.js 16** (App Router) - React framework with server components
- **React 19** - UI library
- **TypeScript** - Type safety
- **OpenAI API** - AI paragraph generation with GPT-4.1-nano
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Authentication with OAuth support
- **PostgreSQL** - Database (Neon)
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization for WPM charts
- **Howler.js** - Audio engine for keyboard sounds
- **Sonner** - Toast notifications
- **Next Themes** - Theme management
- **Nanoid** - Short ID generation for shareable links

## Project Structure

- **app/** - Next.js app directory with pages, API routes, and server actions
- **components/** - React components including the main typing game and UI elements
- **lib/** - Shared utilities, auth configuration, database schema, and text excerpts
- **drizzle.config.ts** - Drizzle ORM configuration

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Apply migrations
- `pnpm db:push` - Push schema changes (dev only)
- `pnpm db:studio` - Open Drizzle Studio

## Game Mechanics

- Timer starts on first keystroke
- Game ends after timer expires (15s or 30s) or when text is completed
- WPM calculated as: `(correct characters / 5) / minutes`
- Accuracy calculated as: `(correct characters / total typed) * 100`
- Race mode shows a ghost cursor tracking any selected leaderboard player's speed
- Share button generates a unique short URL with WPM history and auto-generated OpenGraph images

### AI Paragraph Generation

The typing test uses different paragraph sources based on authentication status:

- **Anonymous users**: Get random excerpts from a curated collection of motivational and educational texts
- **Signed-in users**: Receive AI-generated paragraphs using OpenAI's GPT-4.1-nano model

AI-generated paragraphs are designed to match the style and quality of the curated excerpts with these specifications:
- Length: 150-250 characters (2-3 sentences)
- Style: Motivational, educational, philosophical, or technology-focused
- Topics: Technology, typing, productivity, learning, nature, coding, personal development
- Quality: Perfect grammar, natural flow, accessible vocabulary

If AI generation fails or returns an invalid result, the system automatically falls back to the curated excerpts.

## Database Schema

- `user` - User accounts with timer preference (Better Auth)
- `session` - User sessions (Better Auth)
- `account` - OAuth account data (Better Auth)
- `verification` - Email verification tokens (Better Auth)
- `gameResults` - Game results with WPM, accuracy, duration, and WPM history
- `shareableResults` - Maps short IDs to game results for shareable links
