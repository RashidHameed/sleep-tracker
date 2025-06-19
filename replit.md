# Sleep Tracker App

## Overview

This is a full-stack sleep tracking application built with React, Express.js, and PostgreSQL. The app allows users to log their sleep patterns, view analytics, set smart reminders, and access relaxation tools to improve their sleep quality.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Chart.js for sleep analytics visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for session storage
- **API Design**: RESTful endpoints for sleep logs, reminders, and settings
- **Validation**: Zod schemas shared between client and server

### Data Storage Solutions
- **Primary Database**: PostgreSQL with persistent storage
- **ORM**: Drizzle ORM for type-safe database queries
- **Migration System**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless driver with WebSocket support
- **Initialization**: Automatic database setup with default data

## Key Components

### Database Schema (shared/schema.ts)
- **Sleep Logs**: Tracks bedtime, wake time, sleep quality, and notes
- **Reminders**: Manages bedtime and winddown notifications
- **Alarm Settings**: Configures smart alarm preferences

### API Endpoints (server/routes.ts)
- `GET/POST/DELETE /api/sleep-logs` - Sleep log management
- `GET /api/analytics` - Sleep pattern analysis
- `GET/PUT /api/reminders` - Reminder configuration
- `GET/PUT /api/alarm-settings` - Smart alarm settings

### Frontend Components
- **Sleep Log Form**: Input form for daily sleep data
- **Analytics Dashboard**: Visual charts and insights
- **Smart Reminders**: Configurable notification system
- **Smart Alarm**: Intelligent wake-up scheduling
- **Relaxation Tools**: Breathing exercises and ambient sounds

## Data Flow

1. **Sleep Logging**: Users input sleep data through the form component
2. **Data Validation**: Zod schemas validate data on both client and server
3. **Database Storage**: Drizzle ORM persists data to PostgreSQL
4. **Analytics Generation**: Server processes sleep logs to generate insights
5. **Real-time Updates**: TanStack Query manages cache invalidation
6. **Notification System**: Browser notifications for reminders

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **chart.js**: Data visualization library

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite for frontend with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: PostgreSQL module in Replit

### Production Build
- **Frontend**: Vite builds to `dist/public`
- **Backend**: esbuild bundles server to `dist/index.js`
- **Database**: Connects to production PostgreSQL instance
- **Deployment**: Configured for Replit autoscale deployment

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **DATABASE_URL**: PostgreSQL connection string
- **Port Configuration**: Express serves on port 5000

## Changelog

- June 19, 2025: Initial setup with comprehensive sleep tracking features
- June 19, 2025: Removed data export functionality and relaxation tools timer as requested
- June 19, 2025: Prepared project for GitHub publication with README, LICENSE, and .gitignore
- June 19, 2025: Added PostgreSQL database integration with persistent storage

## User Preferences

Preferred communication style: Simple, everyday language.