# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Start Vite development server with hot reload
- **Build**: `npm run build` - Production build with Vite
- **Development build**: `npm run build:dev` - Build in development mode  
- **Lint**: `npm run lint` - Run ESLint for code quality checks
- **Preview**: `npm run preview` - Preview production build locally

## Project Architecture

This is a React-based mental wellness application built with Vite, TypeScript, and modern React patterns.

### Core Architecture
- **Frontend**: React 18 with TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Authentication**: Google OAuth via Supabase Auth
- **Routing**: React Router v6 with main routes: `/` (SignUp), `/chat`, `/feed`, `/communities`, `/profile`, `/auth`
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Custom hooks with localStorage persistence (`useAppState`) + AuthContext for user state
- **Build Tool**: Vite with SWC for fast compilation
- **Mobile**: Capacitor for iOS/Android deployment

### Key Application Patterns

**Progressive Feature Unlocking**: The app uses a progressive disclosure pattern where features (Feed, Communities, Profile) are unlocked based on user interaction and emotional readiness, managed through `useAppState` hook.

**Dual Chat Modes**: 
- AI Chat: Primary interaction with "Serin" bot using conversation logic in `Chat.tsx:156`
- Peer Chat: Community group chat interface via `GroupChatInterface` component

**State-Driven Navigation**: `BottomNav` component conditionally renders based on `appState.availableFeatures`, hiding navigation until features are unlocked.

**Emotional Intelligence**: The bot responses in `getBotResponse()` function analyze user messages for emotional cues and provide contextual recommendations.

### Component Structure
- **Pages**: Located in `src/pages/` - main route components
- **Components**: Organized by feature areas (community/, profile/, ui/)
- **Hooks**: Custom React hooks in `src/hooks/`
- **State**: App-wide state managed via `useAppState` with localStorage persistence

### Important Files
- `src/hooks/useAppState.ts` - Central state management for feature availability and user progress
- `src/pages/Chat.tsx` - Main chat interface with AI bot logic and conversation flow
- `src/components/BottomNav.tsx` - Conditional navigation based on unlocked features
- `src/App.tsx` - Root routing and provider setup with AuthProvider
- `src/lib/supabase.ts` - Supabase client configuration and database types
- `src/contexts/AuthContext.tsx` - Authentication state management and user operations
- `src/pages/SignUp.tsx` - Google OAuth sign-up page (default route)
- `src/components/ProtectedRoute.tsx` - Route protection wrapper for authenticated pages

### Styling Approach
Uses Tailwind CSS with custom gradient classes and shadcn/ui components. The design emphasizes soft, wellness-focused aesthetics with purple/pink gradients and gentle animations using Framer Motion.

### Voice Integration
ElevenLabs React SDK integrated for voice conversations, though requires agent configuration for full functionality.

## Backend & Authentication

### Supabase Setup
The app uses Supabase as the backend-as-a-service platform providing:
- **PostgreSQL Database**: User profiles and app data
- **Authentication**: Google OAuth integration
- **Real-time**: Future real-time chat features
- **Row Level Security**: Database-level access control

### Authentication Flow
1. **Sign-Up/Sign-In**: Users authenticate via Google OAuth on the SignUp page (`/`)
2. **User Profile Creation**: Automatic profile creation in `profiles` table on first sign-in
3. **Protected Routes**: All main app routes (`/chat`, `/feed`, `/communities`, `/profile`) require authentication
4. **Session Management**: Persistent sessions with automatic token refresh
5. **Sign-Out**: Complete session cleanup and redirect to sign-up page

### Database Schema

#### Profiles Table
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Environment Variables
Required in `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Authentication Context
The `AuthContext` provides:
- `user`: Current authenticated user
- `profile`: User profile data from database
- `session`: Supabase session object
- `loading`: Loading state during auth checks
- `signInWithGoogle()`: Google OAuth sign-in
- `signOut()`: Sign-out functionality
- `updateProfile()`: Update user profile data

### Route Protection
- **Public Routes**: `/` (SignUp), `/auth`
- **Protected Routes**: All others wrapped in `<ProtectedRoute>` component
- **Auto-Redirect**: Authenticated users accessing `/` redirect to `/chat`
- **Auth Required**: Unauthenticated users accessing protected routes redirect to `/`