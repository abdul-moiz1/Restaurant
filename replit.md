# Gourmet Haven - Restaurant Platform

## Overview

Gourmet Haven is a dual-role restaurant platform built with React and Firebase that serves both restaurant owners and customers. The application allows restaurant owners to manage their menu items (create, update, delete dishes) while customers can browse available dishes and set dietary preferences. The platform features a modern, elegant design inspired by upscale restaurant platforms like OpenTable and Resy, with a focus on culinary refinement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query for server state management and data fetching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with a custom design system
- Design tokens defined for consistent spacing, typography, and colors
- Custom theme based on "new-york" style with neutral base colors
- Gold accent color (#c9a348) as primary brand color
- Serif fonts (Playfair Display/Cormorant Garamond) for headings, sans-serif (Inter/Source Sans Pro) for body text

**State Management**
- React Context API for authentication state (AuthContext)
- Local component state with useState for form management
- TanStack Query for caching and synchronizing server data

**Routing Strategy**
- Public routes: Home page (browsable menu without authentication)
- Protected routes with role-based access control:
  - Customer Dashboard (requires "customer" role)
  - Owner Dashboard (requires "owner" role)
- Automatic redirects based on authentication status and user role

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- TypeScript for type safety across server code
- Custom middleware for request logging and JSON parsing

**API Design**
- RESTful API endpoints prefixed with `/api`
- Routes registered through a centralized routing system
- Currently using in-memory storage interface (MemStorage)
- Storage interface designed to be swappable with database implementation

**Authentication & Authorization**
- Firebase Authentication for user management
- Email/password and Google OAuth sign-in methods
- Role-based access control with two user types: "owner" and "customer"
- User roles stored in Firestore and cached in React Context
- Protected routes enforce role requirements on both client and server

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Schema defined with user table containing username and password fields
- Database URL configured via environment variable (DATABASE_URL)
- Migrations managed through Drizzle Kit

**Firebase Firestore**
- Primary data store for application data
- Collections:
  - `users/{uid}`: User profile data including role, email, createdAt
  - `users/{uid}/preferences/dietary`: Customer dietary preferences
  - `menu`: Restaurant menu items with dish details
- Menu items include: name, description, price, imageUrl, tags, available status, ownerId
- Queries filtered by ownerId for owner-specific menu management

**Firebase Storage**
- Cloud storage for dish images uploaded by restaurant owners
- Images stored in `dishes/` folder with timestamp-based naming
- Supports drag-and-drop file upload with real-time preview
- File validation: image types only (JPG, PNG, GIF), max 5MB
- Upload progress tracking with visual feedback
- Automatically generates public URLs for uploaded images

**Storage Interface Pattern**
- Abstract IStorage interface defines CRUD operations
- MemStorage implementation for development/testing
- Designed to support swapping to Postgres/Drizzle implementation
- Methods include: getUser, getUserByUsername, createUser

### External Dependencies

**Firebase Services**
- Firebase Authentication: User sign-up, login, Google OAuth
- Firebase Firestore: NoSQL document database for storing users, preferences, and menu items
- Configuration via environment variables (VITE_FIREBASE_*)
- Initialized in `client/src/lib/firebase.ts`

**Third-Party UI Libraries**
- Radix UI: Accessible, unstyled component primitives (dialogs, dropdowns, forms, etc.)
- Lucide React: Icon library for UI elements
- React Hook Form with Zod resolvers: Form validation and management
- date-fns: Date formatting and manipulation

**Development Tools**
- Replit-specific plugins for development environment
- ESBuild for server-side bundling in production
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Session Management**
- connect-pg-simple: PostgreSQL session store for Express sessions
- Configured for potential session-based authentication alongside Firebase