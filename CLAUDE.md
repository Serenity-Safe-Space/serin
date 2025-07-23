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
- **Routing**: React Router v6 with main routes: `/` (Chat), `/feed`, `/communities`, `/profile`, `/auth`
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Custom hooks with localStorage persistence (`useAppState`)
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
- `src/App.tsx` - Root routing and provider setup

### Styling Approach
Uses Tailwind CSS with custom gradient classes and shadcn/ui components. The design emphasizes soft, wellness-focused aesthetics with purple/pink gradients and gentle animations using Framer Motion.

### Voice Integration
ElevenLabs React SDK integrated for voice conversations, though requires agent configuration for full functionality.