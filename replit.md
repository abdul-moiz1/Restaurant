# Gourmet Haven - Restaurant Platform

## Overview

Gourmet Haven is a dual-role restaurant platform built with React and Firebase that serves both restaurant owners and customers. The application allows restaurant owners to manage their menu items (create, update, delete dishes) while customers can browse available dishes and set dietary preferences. The platform features a modern, elegant design inspired by upscale restaurant platforms like OpenTable and Resy, with a focus on culinary refinement.

## Recent Changes (November 2025)

**Latest Update: Fixed DishForm for Complete Filtering Functionality**
- Added cuisineType and dietary fields to DishForm state and submission
- Implemented Select dropdown for cuisine type selection (Italian, Asian, American, Mediterranean, Desserts, Mexican, French)
- Added Checkbox inputs for dietary preferences (Vegan, Keto, Gluten-Free, Vegetarian)
- Owners can now properly tag dishes with cuisine type and dietary info when adding/editing
- All newly created dishes now participate in Menu page filtering
- Fixed critical issue where dishes without metadata would be excluded from filters

**Complete UI Redesign**
- Redesigned home page with animated golden logo (UtensilsCrossed icon with pulse and rotate animations)
- Enhanced hero section with "Elevate Your Dining Experience" headline and "Refined global cuisine, curated for your taste" tagline
- Moved preferences section below hero with cuisine filters, dietary restrictions, price range slider
- Updated color palette to gold (#D4AF37) and ivory (#FAF7F2) for premium aesthetic
- Created elegant footer with animated plate and fork icons, contact information, and copyright
- Implemented comprehensive Framer Motion animations across all pages with hover/tap effects
- Added glass morphism effects on cards with backdrop blur and subtle shadows
- Enhanced Owner Dashboard with icon-based statistics cards showing Total Dishes, Available, and Out of Stock counts

**Shopping Cart System**
- Created CartContext with React Context API for global cart state management
- Implemented Cart page (/cart) with item management and checkout flow for customers
- Added "Add to Cart" functionality throughout Menu page and MenuCard components
- Cart icon in navbar shows item count badge for logged-in customers
- Cart state persists in localStorage for seamless experience
- Toast notifications for cart actions (add, remove, clear, checkout)

**Enhanced Menu Page**
- Real-time search across dish names, descriptions, and tags
- Filter by dietary type (All, Vegetarian, Vegan, Pescatarian, etc.)
- Filter by cuisine type with multi-select (Italian, Japanese, Indian, etc.)
- Price range slider for budget filtering
- Availability badges showing "Available" or "Unavailable" status
- "Add to Cart" buttons with shopping cart icons
- Resilient filtering that handles missing Firestore fields gracefully

**Owner Dashboard Improvements**
- Updated styling to match new gold/ivory color scheme
- Maintained Firebase Storage image upload with drag-and-drop support
- Dish management (add, edit, delete) with real-time updates
- Dashboard statistics showing total dishes, available count, and average price
- Modal-based add/edit dish forms with comprehensive fields

**Navigation & Routing**
- Updated navbar to show Login button only when not authenticated
- Cart icon appears for logged-in customers with item count badge
- Removed Preferences link from navbar (preferences now on Home page)
- Uses wouter for proper SPA navigation (no window.location.href)
- Smooth transitions between pages preserving auth and cart context

**Authentication & Role Selection**
- Role selector modal for Google Sign-In (Customer vs Owner selection)
- Visual role cards with icons and descriptions
- Email/password login with role stored in Firestore
- Automatic redirection based on user role after authentication

**Sample Data**
- Created sample dishes script (scripts/add-sample-dishes.ts) with 10 realistic menu items
- Includes diverse cuisines: Italian, Japanese, Indian, Mediterranean, American
- Covers all dietary types: Vegetarian, Vegan, Pescatarian, All
- High-quality Unsplash images for each dish
- Price range from $12 to $65 for testing filters

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
- Custom theme based on "new-york" style with premium colors
- Gold (#D4AF37) and ivory (#FAF7F2) color palette for elegant restaurant aesthetic
- Serif fonts (Playfair Display/Cormorant Garamond) for headings, sans-serif (Inter/Source Sans Pro) for body text
- Framer Motion for smooth animations and transitions
- Glass morphism effects with backdrop blur on cards and overlays

**State Management**
- React Context API for authentication state (AuthContext) and shopping cart (CartContext)
- CartContext manages global cart state with localStorage persistence
- Local component state with useState for form management
- TanStack Query for caching and synchronizing server data

**Routing Strategy**
- Public routes (accessible without authentication):
  - Home page (/) - Hero banner with animated logo, tagline, and preferences section
  - Menu page (/menu) - Browse all available dishes with search, filters, and "Add to Cart"
  - Login (/login) - Email/password and Google OAuth authentication
  - Signup (/signup) - Account creation with role selection
- Protected routes with role-based access control:
  - Cart (/cart) - Shopping cart page (requires "customer" role)
  - Owner Dashboard (/dashboard) - Menu management (requires "owner" role)
- Automatic redirects based on authentication status and user role
- Uses wouter for SPA navigation to preserve React Context state

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
- Menu items include: name, description, price, imageUrl, tags, available status, ownerId, cuisineType (optional), dietary array (optional)
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
- Lucide React: Icon library for UI elements (UtensilsCrossed, ShoppingCart, User, Store, etc.)
- React Hook Form with Zod resolvers: Form validation and management
- Framer Motion: Animation library for smooth transitions and interactive effects
- React Hot Toast: Modern toast notifications for user feedback
- date-fns: Date formatting and manipulation

**Development Tools**
- Replit-specific plugins for development environment
- ESBuild for server-side bundling in production
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Session Management**
- connect-pg-simple: PostgreSQL session store for Express sessions
- Configured for potential session-based authentication alongside Firebase