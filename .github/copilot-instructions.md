# AI Coding Instructions for Zenji

## Project Overview
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Stack**: OpenAI (LLM & Embeddings), ChromaDB (Vector Store), RAG Architecture
- **Fonts**: Geist (via `next/font`)
- **Package Manager**: npm

## Architecture & Structure
- **App Router**: All routes are defined in the `app/` directory.
  - `app/layout.tsx`: Root layout containing global providers and font configurations.
  - `app/page.tsx`: The main entry point/landing page.
  - `app/chat/`: Chat feature.
    - `page.tsx`: Client-side chat interface.
    - `actions.ts`: Server Actions for RAG and LLM orchestration.
- **Shared Code**:
  - `lib/`: Core application logic.
    - `openai.ts`: OpenAI client and embedding helper.
    - `chroma.ts`: ChromaDB client and collection management.
    - `rag.ts`: Retrieval logic combining embeddings and vector search.
    - `prompts.ts`: System prompts and conversation guidelines.
  - `data/`: Data storage (e.g., `remedies.json`).
- **Path Aliases**: Use `@/` to import from the project root (e.g., `import { utils } from "@/lib/utils"`).

## Development Workflow
- **Start Dev Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`

## Environment Setup
- **Required Variables** (`.env.local`):
  - `OPENAI_API_KEY`: OpenAI API key.
  - `CHROMA_URL`: URL for ChromaDB instance (default: `http://localhost:8000`).

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
- **AI/RAG Flow**:
  1. User sends message via Client Component (`app/chat/page.tsx`).
  2. Server Action (`app/chat/actions.ts`) receives message.
  3. `retrieveRelevantRemedies` (`lib/rag.ts`) embeds query and searches ChromaDB.
  4. Retrieved context + System Prompt (`lib/prompts.ts`) + User Message sent to OpenAI.
  5. Response returned to client.
- **Server Actions**: Use `actions.ts` files for server-side logic called directly from Client Components.
- **Fonts**: Apply the Geist font family using the CSS variables `--font-geist-sans` and `--font-geist-mono` configured in `app/layout.tsx`.
- **Image Optimization**: Use the `next/image` component for all images to ensure optimization.
