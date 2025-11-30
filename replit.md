# Student Opportunity Discovery Platform

## Overview

INSIGHT is a web platform designed to help students discover and filter through volunteering opportunities, internships, and summer programs. The platform emphasizes findability and speed, allowing students to quickly locate relevant opportunities based on criteria like funding status, location, competitiveness, and career area. Built with a hybrid design approach combining Notion's clean information architecture with Airbnb's card-based browsing, the platform features a special focus on Ecuador-based opportunities.

**Admin Panel**: The platform includes a password-protected admin interface at `/admin-login` where authorized users can add, edit, and delete opportunities through a user-friendly dashboard. The admin panel also includes a Site Content tab for editing the footer (About section), Quick Links, Resource Links, and the Scholarship Tips page content.

**Tips Page**: A dedicated page at `/tips` with admin-editable scholarship tips and application guidance using simple markdown formatting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing

**UI Component Library**
- Shadcn/ui components built on Radix UI primitives for accessible, customizable UI elements
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- Custom design system with elevation utilities (`hover-elevate`, `active-elevate-2`) and standardized spacing

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local React state for UI interactions and filters
- Query invalidation strategy with infinite stale time for static opportunity data

**Design System Approach**
- Neutral color palette with HSL-based theming supporting light/dark modes
- Typography hierarchy using Inter/DM Sans fonts via Google Fonts
- Responsive grid layouts (1 column mobile → 2 columns tablet → 3 columns desktop)
- Card-based opportunity browsing with sticky filter sidebar on desktop

### Backend Architecture

**Server Framework**
- Express.js server handling API routes and serving static assets
- Custom middleware for request logging and JSON response capturing
- Vite integration in development mode for HMR support

**API Design**
- RESTful endpoints under `/api` namespace
- Query parameter-based filtering for opportunities (funding, competitiveness, language, country, careerArea)
- Support for multiple filter values using array query parameters
- CRUD operations for opportunity management

**Data Layer**
- Storage abstraction interface (`IStorage`) allowing multiple implementations
- In-memory storage implementation (`MemStorage`) for development/testing
- Drizzle ORM configured for PostgreSQL production use
- Schema-driven validation using Zod and drizzle-zod integration

### Data Schema

**Opportunity Model**
- Core fields: title, organization, description, location, country, URL
- Temporal data: deadline, reopenDate, deadlineStatus (open/reopening/closed)
- Classification: competitiveness (low/low-medium/medium/medium-high/high), funding (free/paid/partially-funded/fully-funded)
- Multi-value arrays: language support, career areas (includes STEM, Arts, Healthcare, Business, Education, Social Impact, Sports)
- Metadata: duration, age range

**Type Safety**
- Shared schema definitions between client and server via `@shared/schema`
- Zod schemas for runtime validation of insert operations
- TypeScript inference from Drizzle schema for compile-time safety

### Filtering & Search System

**Client-Side Filtering**
- Multi-criteria filtering: funding status, competitiveness level, languages, countries, career areas
- Search functionality across opportunity titles, organizations, and keywords
- Quick filter badges for common use cases (Fully Funded, Ecuador Only, Closing Soon)
- Filter state management with clear/reset functionality

**Server-Side Filtering**
- Query parameter parsing supporting both single values and arrays
- Array-based filtering with `.includes()` for single-value fields
- `.some()` filtering for multi-value array fields (languages, career areas)
- Efficient in-memory filtering suitable for moderate dataset sizes

### Responsive Design Strategy

**Mobile-First Approach**
- Collapsible filter drawer on mobile using Sheet component
- Filter toggle button with `SlidersHorizontal` icon
- Full-width card layout on small screens

**Desktop Layout**
- Sticky sidebar filter panel (width: 16-18rem)
- 3-column opportunity grid with gap spacing
- Hero section at 60-70vh height with background image overlay

**Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px (md)
- Desktop: ≥ 1024px (lg)

## External Dependencies

### Database
- **Neon Database** (@neondatabase/serverless): Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe SQL query builder and schema management
- **drizzle-kit**: Schema migrations and database push operations
- Connection via DATABASE_URL environment variable

### UI Components
- **Radix UI**: Comprehensive set of unstyled, accessible component primitives including dialogs, dropdowns, accordions, sliders, and form controls
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Static type checking with strict mode enabled
- **Vite Plugins**: Runtime error overlay, cartographer (Replit integration), dev banner
- **tsx**: TypeScript execution for Node.js server runtime

### Supporting Libraries
- **date-fns**: Date manipulation and formatting
- **React Hook Form** + **@hookform/resolvers**: Form state management with Zod validation
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider functionality
- **class-variance-authority** + **clsx** + **tailwind-merge**: Advanced className composition

### Session & State
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used in current implementation)

### Asset Management
- Images stored in `/attached_assets/` directory
- Vite alias `@assets` for clean import paths
- Static asset serving in production via Express