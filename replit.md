# Gourmet Haven - Restaurant Platform

## Overview

Gourmet Haven is a dual-role restaurant platform built with React and Firebase that serves both restaurant owners and customers. The application allows restaurant owners to manage their menu items (create, update, delete dishes) while customers can browse available dishes and set dietary preferences. The platform features a modern, elegant design inspired by upscale restaurant platforms like OpenTable and Resy, with a focus on culinary refinement.

## Recent Changes (November 2025)

**Enhanced User Experience**
- Redesigned home page with premium hero banner featuring parallax zoom effect on hover
- Added "Refined global cuisine, curated for your taste" as the main tagline
- Implemented smooth scroll-to-menu functionality with animated chevron button
- Created dedicated Menu page (/menu) with live search and dietary filters
- Built Preferences page (/preferences) for customers to set dietary restrictions, allergens, and spice tolerance
- Added Checkout page (/checkout) as protected route for authenticated customers

**Navigation & Routing**
- Enhanced navbar with Home, Menu, and Preferences links accessible to all users
- Active link highlighting with gold accent color
- Role-based dashboard link (Dashboard for owners, Checkout for customers)
- Improved responsive design for mobile devices

**Design Enhancements**
- Gold accent color (#c9a348) consistently applied throughout the app
- Playfair Display serif font for headings, creating elegant typography
- Smooth hover transitions and subtle shadows on interactive elements
- Added react-hot-toast for modern toast notifications
- Implemented footer with copyright information
- Enhanced spacing and visual hierarchy across all pages

**Authentication Improvements**
- Added displayName field to user signup flow
- Updated all authentication forms to support full name collection
- Improved Google OAuth integration with role selection

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
- Public routes (accessible without authentication):
  - Home page (/) - Hero banner with featured dishes
  - Menu page (/menu) - Browse all available dishes with search and filters
  - Preferences page (/preferences) - Set dietary preferences and allergens
  - Login (/login) - Email/password and Google OAuth authentication
  - Signup (/signup) - Account creation with role selection
- Protected routes with role-based access control:
  - Checkout (/checkout) - Customer-only checkout page (requires "customer" role)
  - Owner Dashboard (/owner) - Menu management (requires "owner" role)
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
- User profiles include: uid, email, displayName, role, createdAt
- Protected routes enforce role requirements on both client and server
- Role selection during signup for both email and Google authentication

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL
- Schema defined with user table containing username and password fields
- Database URL configured via environment variable (DATABASE_URL)
- Migrations managed through Drizzle Kit

**Firebase Firestore**
- Primary data store for application data
- Collections:
  - `users/{uid}`: User profile data including role, email, displayName, createdAt
  - `menu`: Restaurant menu items with dish details
- Menu items include: name, description, price, imageUrl, tags, available status, ownerId, dietaryType (optional), allergens (optional), spiceLevel (optional)
- Customer preferences stored in localStorage for filtering menu items
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