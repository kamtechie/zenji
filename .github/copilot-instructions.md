# AI Coding Instructions for Zenji

## Project Overview
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist (via `next/font`)
- **Package Manager**: npm

## Architecture & Structure
- **App Router**: All routes are defined in the `app/` directory.
  - `app/layout.tsx`: Root layout containing global providers and font configurations.
  - `app/page.tsx`: The main entry point/landing page.
  - `app/chat/`: Designated area for chat-related features (currently empty).
- **Shared Code**:
  - `lib/`: Utility functions and shared logic.
  - `data/`: Static data definitions and data fetching logic.
- **Path Aliases**: Use `@/` to import from the project root (e.g., `import { utils } from "@/lib/utils"`).

## Development Workflow
- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`

## Coding Conventions
- **Components**: 
  - Prefer **Server Components** by default.
  - Add `'use client'` at the top of files only when using hooks (`useState`, `useEffect`) or event listeners.
- **Styling**: 
  - Use **Tailwind CSS** utility classes directly in `className` props.
  - Utilize CSS variables defined in `app/globals.css` for theming if applicable.
- **TypeScript**: 
  - Maintain strict type safety.
  - Define explicit interfaces for component props and data models.
  - Avoid `any` types.

## Specific Patterns
- **Fonts**: Apply the Geist font family using the CSS variables `--font-geist-sans` and `--font-geist-mono` configured in `app/layout.tsx`.
- **Image Optimization**: Use the `next/image` component for all images to ensure optimization.
