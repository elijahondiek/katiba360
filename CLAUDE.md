# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Katiba360° is a Progressive Web App (PWA) that makes Kenya's constitution accessible to everyone through simple language and practical examples. Built with Next.js 15, React 19, and TypeScript.

## Essential Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production (includes service worker generation)
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

**IMPORTANT**: No testing framework is currently implemented. When adding tests, you'll need to set up Jest + React Testing Library first.

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State**: React Context API (no Redux/Zustand)
- **PWA**: next-pwa with Workbox
- **Auth**: Custom OAuth with Google (no NextAuth.js)
- **Backend**: FastAPI (separate repository)

### Key Architectural Patterns

1. **App Router Structure**: All pages use Next.js 15 App Router in `/app` directory
2. **Context Providers**: Authentication, Language, and Offline contexts wrap the app
3. **Service Layer**: API calls abstracted in `/services` directory
4. **Offline-First**: IndexedDB for content storage, service workers for caching
5. **Multi-language**: 6 languages with dynamic switching and fallbacks

### Directory Structure

```
app/                    # Next.js pages (App Router)
├── api/               # API routes (auth endpoints)
├── chapters/          # Constitution chapters (dynamic routes)
└── [pages]/          # Feature pages (auth, profile, etc.)

components/            # Reusable components
├── ui/               # Radix UI-based primitives
├── auth/             # Authentication components
└── chapters/         # Chapter-specific components

contexts/             # React Context providers
├── AuthContext       # Google OAuth state
├── LanguageContext   # Translation management
└── OfflineContext    # Offline/PWA functionality

hooks/                # Custom React hooks
├── chapters/         # Reading progress, bookmarks
└── [utilities]/      # General utility hooks

services/             # API and service layer
├── api.ts           # Main API client
├── auth.ts          # Authentication services
└── offline.ts       # Offline functionality

translations/         # Language JSON files (6 languages)
```

## Critical Implementation Details

### Authentication Flow
- Uses custom Google OAuth implementation (not NextAuth.js)
- JWT tokens stored in cookies via API routes
- Automatic token refresh implemented in AuthContext
- Protected routes use middleware pattern

### Offline Functionality
- Complete PWA implementation with next-pwa
- IndexedDB stores chapter content for offline reading
- Service worker caches static assets and API responses
- Offline status detection with visual indicators

### Translation System
- 6 languages: English, Swahili, Kikuyu, Luo, Kalenjin, Kamba
- Dynamic language switching with LanguageContext
- Fallback to English for missing translations
- Language preference persisted in localStorage

### Chapter Structure
- Constitution has 18 chapters with parts-based structure
- Dynamic routing: `/chapters/[chapterId]` and `/chapters/[chapterId]/[partId]`
- Reading progress tracked per user with completion thresholds
- Bookmarking system with efficient API usage

## Development Guidelines

### Component Patterns
- Use existing UI components from `/components/ui` (Radix-based)
- Follow established patterns in existing components
- All components are TypeScript with proper types
- Use Tailwind classes, avoid inline styles

### API Integration
- All API calls go through `/services/api.ts`
- Use the existing `apiRequest` helper for consistency
- Handle offline scenarios with try-catch blocks
- Check `isOnline` from OfflineContext before API calls

### State Management
- Use React Context for global state (no Redux)
- Local component state with useState/useReducer
- Custom hooks in `/hooks` for reusable logic
- Avoid prop drilling - use context when needed

### Code Style
- TypeScript strict mode is enabled
- Use absolute imports with `@/` prefix
- Follow existing naming conventions
- Keep components focused and single-purpose

## Known Issues & Gaps

### Missing Features
- **Testing**: No test framework or tests exist
- **Error Boundaries**: Not implemented globally
- **Code Splitting**: Large bundles not optimized
- **Image Optimization**: Disabled in next.config.mjs

### Configuration Issues
- Package name is "my-v0-project" (should be "katiba360")
- ESLint/TypeScript errors ignored in builds
- Production console logs not removed
- Images unoptimized in next.config.mjs

### Performance Considerations
- Long chapter lists need virtualization
- Bundle size needs optimization
- No lazy loading for heavy components
- Missing performance monitoring

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- Additional CORS and service URLs

See `.env.local.sample` for complete list.

## Design System

Colors follow Kenyan flag theme:
- Primary Green: `#0A7B24`
- Secondary Green: `#1EB53A`
- Accent Red: `#CE1126`

See `Global Design Guide.txt` for complete design guidelines.