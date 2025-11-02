# Gourmet Haven - Restaurant Platform

## Overview
Gourmet Haven is a dual-role restaurant platform built with React and Firebase, designed for both restaurant owners and customers. Owners can manage their menu items (create, update, delete dishes), while customers can browse dishes, set dietary preferences, and place orders. The platform emphasizes a modern, elegant design inspired by upscale culinary experiences, focusing on refined aesthetics and streamlined user flows, including guest checkout capabilities and role-based access.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
### November 2, 2025
- **Toast Notifications**: Updated toast auto-dismiss delay from 16+ minutes to 5 seconds for better UX
- **Login Page Enhancements**:
  - Fixed role switching: Login page now updates dynamically when user changes role from navbar via localStorage listener
  - Added "Forgot password?" link that displays a toast notification
  - Added "Sign up" button for customers that redirects to signup page
- **Order History Page Fixes**:
  - Fixed Firestore query issue that prevented orders from displaying (removed composite index requirement)
  - Added JavaScript-based sorting by creation date as fallback
  - Implemented date-based tabs (All, Today, Yesterday, This Week, Earlier) for better organization
  - Added improved error logging for debugging order fetch issues
  - Enhanced UI with empty states for each tab

## System Architecture

### Frontend Architecture
The frontend uses React with TypeScript and Vite. It leverages `wouter` for lightweight client-side routing and TanStack Query for server state management. UI components are built with `shadcn/ui` (based on Radix UI primitives) and styled with Tailwind CSS, adhering to a custom design system with a premium gold and ivory color palette. Framer Motion provides smooth animations and glass morphism effects. State management is handled by React Context API for authentication and the shopping cart, with `localStorage` persistence for the cart. Routing includes public, customer-protected, and owner-protected routes with automatic redirects based on authentication and role.

### Backend Architecture
The backend is built with Express.js and TypeScript, designed with RESTful API endpoints. It currently uses an in-memory storage interface (`MemStorage`) but is designed to be swappable with a PostgreSQL/Drizzle ORM implementation. Authentication and authorization are managed via Firebase Authentication, supporting email/password and Google OAuth. User roles ("owner" and "customer") are stored in Firestore and enforced on both client and server sides for protected routes.

### Data Storage Solutions
**Firebase Firestore** is the primary data store for user profiles, menu items, and order tracking. Menu items include details like name, description, price, image URL, tags, availability, cuisine type, and dietary information. **Firebase Storage** is used for storing dish images uploaded by owners, with drag-and-drop support and validation. A generic `IStorage` interface is defined to allow for future integration with **PostgreSQL** via Drizzle ORM, with schema definitions for users and `connect-pg-simple` for session management.

## External Dependencies
*   **Firebase Services**: Firebase Authentication (user management, Google OAuth), Firebase Firestore (database for users, menu, orders), Firebase Storage (dish images).
*   **Third-Party UI Libraries**: Radix UI (unstyled components), Lucide React (icons), React Hook Form with Zod (form validation), Framer Motion (animations), React Hot Toast (notifications), date-fns (date utilities).
*   **Development Tools**: Replit-specific plugins, ESBuild, PostCSS (with Tailwind and Autoprefixer).