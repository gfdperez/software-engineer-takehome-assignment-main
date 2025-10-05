# Take-Home Assignment: Inventory Management System

## Overview

Welcome! This take-home assignment is designed to evaluate your full-stack development skills with a focus on frontend implementation. You'll be building a simplified inventory management system inspired by modern ERP solutions.

---

## Tech Stack Requirements

You must use the following technologies:

- **Framework:** Next.js 14+ with TypeScript
- **Database:** Prisma ORM with SQLite (for simplicity)
- **API Layer:** tRPC for type-safe APIs
- **Data Fetching:** @tanstack/react-query (TanStack Query)
- **Styling:** Material UI (MUI) or Tailwind CSS (your choice)
- **Forms:** React Hook Form with Zod validation
- **Version Control:** Git with meaningful commit messages

---

## Core Features (Required)

### 1. Product Management

#### Product CRUD Operations
- **List View:**
  - Responsive data table with pagination
  - Search functionality (by product name, SKU)
  - Sort columns (name, SKU, created date)
  - Quick actions (edit, delete, view details)
  - Loading states and skeleton screens
  - Empty states when no products exist

- **Create/Edit Form:**
  - Product name (required)
  - SKU (required, unique)
  - Description (optional, textarea)
  - Base price (required, number validation)
  - Barcode (optional)
  - Form validation with clear error messages
  - Success/error notifications
  - Optimistic updates for better UX

- **Detail View:**
  - Display all product information
  - Stock levels across all locations (table view)
  - Edit and delete actions

### 2. Inventory Location Management

Manage multiple warehouses or store locations with stock tracking.

**Location CRUD Operations:**
- **List View:**
  - Table of all locations
  - Show total products stocked per location
  - Show total stock value per location

- **Create/Edit Form:**
  - Location name (required)
  - Address (optional)
  - Contact person (optional)
  - Contact number (optional)
  - Capacity/notes (optional)

### 3. Stocktake Module

Implement a physical inventory count feature:

**Stocktake Session:**
- Create a new stocktake session for a specific location
- Session details:
  - Location
  - Date/time started
  - Counted by (user name/ID)

**Counting Interface:**
- List all products expected in that location
- For each product, show:
  - Product name and SKU
  - System quantity (current stock level)
  - Count field (input for actual counted quantity)
  - Variance (calculated: counted - system quantity)
  - Visual indicator for discrepancies (red if variance, green if match)

**Stocktake Completion:**
- Show a **confirmation modal** before with brief description
- Upon confirmation, update stock levels based on counted quantities
- Save the stocktake record with final counts

### 4. Data Relationships & Validation

Your database schema should properly handle:
- Products can have stock in multiple locations
- Stock levels are location-specific
- Proper foreign keys and cascading deletes
- Unique constraints where needed (SKU, location names)
- **Soft deletion** for products and locations (use `deletedAt` timestamp field instead of hard deletes)
  - When a product/location is "deleted", set `deletedAt` to current timestamp
  - Filter out soft-deleted records in queries by default
  - Soft-deleted records should not appear in dropdowns or lists
  - Optional: Admin view to see and restore soft-deleted records

---

## Bonus Features (Optional - Choose 1-2 if time permits)

### Bonus 1: Dashboard Module

Create a dashboard page with key metrics and visualizations:

**Key Metrics Cards:**
- Total number of products
- Total number of locations
- Total stock value (sum of all stock × product price)
- Low-stock items (display as a list showing product name, SKU, and current quantity)

**Visualizations:**
- **Stock value by location** (Bar chart)
  - X-axis: Location names
  - Y-axis: Total value ($)
  - Shows inventory value distribution across warehouses

- **Top 10 products by quantity** (Horizontal bar chart)
  - X-axis: Quantity (units)
  - Y-axis: Product names
  - Identifies highest-stocked items

- **Stock level trend** (Line chart)
  - X-axis: Date
  - Y-axis: Total units across all locations
  - Tracks overall inventory levels over time

- **Low stock alerts over time** (Line chart)
  - X-axis: Date
  - Y-axis: Number of low-stock products
  - Monitors inventory health trends

**Tech Recommendations:**
- Use a charting library like Recharts or MUI X Charts
- Responsive cards layout

### Bonus 2: LLM Integration

Integrate AI capabilities into the inventory system:

**Suggested Features:**
- Natural language queries (e.g., "Show me products with low stock in Warehouse A")
- Smart search across products and locations
- Automated suggestions for stock replenishment
- Generate descriptions or summaries from inventory data
- Chatbot for inventory-related questions

**Tech Recommendations:**
- Use OpenAI API, Anthropic Claude API, or similar
- Implement proper error handling and rate limiting
- Consider cost implications of API calls

---

## Technical Requirements

### Frontend Excellence

**Component Architecture:**
- Reusable components with clear props interfaces
- Proper component composition (avoid prop drilling)
- Custom hooks for shared logic
- Consistent file/folder structure

**State Management:**
- Effective use of React Query for server state
- Proper loading, error, and success states
- Optimistic updates for better UX
- Form state management with React Hook Form

**TypeScript Usage:**
- Strict mode enabled
- Proper typing for all props, state, and API responses
- No `any` types (use `unknown` if needed)
- Type inference where appropriate

**UI/UX:**
- Responsive design (mobile, tablet, desktop)
- Consistent spacing and typography
- Loading skeletons for better perceived performance
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- Accessible forms with proper labels and error messages

**Performance:**
- Pagination for large lists
- Debounced search inputs
- Memoization where needed (React.memo, useMemo, useCallback)

### Backend Implementation

**tRPC API Design:**
- Well-structured routers (products, locations, stock, stocktakes)
- Input validation using Zod schemas
- Proper error handling with meaningful messages
- Type-safe procedures (query/mutation)

**Database Schema:**
- Normalized schema with proper relationships
- Indexes on frequently queried fields

**Data Validation:**
- Server-side validation (don't rely on client-side only)
- Business logic validation (e.g., stock cannot be negative)
- Unique constraints enforced
- Cascading deletes handled appropriately

### Code Quality

**Clean Code:**
- Consistent naming conventions (camelCase, PascalCase)
- Meaningful variable and function names
- Small, focused functions
- Comments for complex logic (but prefer self-documenting code)
- No commented-out code in final submission

**Error Handling:**
- Try-catch blocks for async operations
- User-friendly error messages

**Git Hygiene:**
- Meaningful commit messages
- Logical commit structure (not just one big commit)
- No sensitive data in commits
- Clean git history

---

## Evaluation Criteria

Your submission will be evaluated on:

| Criterion                  | What We Look For                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| **UI/UX Design**           | Visual polish, responsive design, intuitive navigation, loading/error states, attention to detail |
| **Frontend Architecture**  | Component structure, state management, TypeScript usage, code organization, reusability           |
| **Full-Stack Integration** | API design, database schema, data flow, validation, error handling                                |
| **Code Quality**           | Readability, maintainability, best practices, documentation, git commits                          |
| **Problem Solving**        | Handling edge cases, creative solutions, bonus features, going beyond requirements                |

### What Impresses Us

- Pixel-perfect UI with attention to detail
- Smooth user experience with loading states and transitions
- Clean, well-organized code that's easy to read
- Thoughtful error handling and edge case management
- Smart state management decisions
- Accessibility considerations (ARIA labels, keyboard navigation)
- Performance optimizations (pagination, debouncing, memoization)
- Creative UI patterns for complex features (stocktake interface, confirmation modals)
- Tests for critical functionality
- Clear documentation of design decisions


---

## Starter Template

A starter template has been provided with:

- Next.js 14 with TypeScript configured
- Prisma setup with SQLite database
- tRPC boilerplate with example router
- React Query configured
- Material UI or Tailwind CSS (pick one)
- ESLint and Prettier configured
- Example environment variables
- Basic folder structure

**To get started:**

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Deliverables

1. **GitHub Repository**
   - Public or private repo (if private, add our GitHub usernames)
   - Complete source code
   - Clear README with setup instructions
   - `.env.example` file

2. **Live Demo (Optional)**
   - Deploy to Vercel, Netlify, or similar
   - Include URL in your README
   - Ensure database is seeded with sample data

3. **Documentation (optional)**
   - Brief write-up (can be in README or separate doc):
     - Design decisions you made
     - Trade-offs and why you made them
     - What you would improve with more time
     - Time breakdown (how long you spent on each part)
     - Instructions for running tests (if applicable)

4. **Optional Extras**
   - Loom video (5-10 min) walking through your solution
   - Architecture diagram
   - Screenshots of key features

---

## FAQs

**Q: Can I use a different tech stack?**
A: No, please use the required tech stack. This ensures we can evaluate all candidates fairly.

**Q: Should I implement all bonus features?**
A: No! Bonus features are optional. We'd rather see 1-2 bonus features done well than all of them done poorly. Focus on core features first.

**Q: Can I use AI tools like Copilot or ChatGPT?**
A: Yes, you can use AI tools as you would in a real work environment. However, make sure you understand all the code you submit.

**Q: What if I can't finish everything?**
A: That's okay! Submit what you have. We'd rather see well-implemented core features than rushed, incomplete bonus features. Document what you would do with more time.

**Q: Can I use component libraries?**
A: Yes! Using pre-built components from MUI or other libraries is encouraged. Focus on building good UX, not reinventing wheels.

**Q: How do I submit?**
A: Send us:
- Link to your GitHub repository
- Live demo URL (if deployed)
- Any additional documentation

**Q: Who can I contact if I have questions?**
A: Email us at chase@oboda.io if you have any clarifications needed.

---

## Good Luck!

We're excited to see what you build! Remember:

- **Quality over quantity** - focus on doing core features well
- **User experience matters** - think about how real users would interact with your app
- **Code clarity** - write code that others can read and maintain
- **Ask questions** - if anything is unclear, reach out to us

Happy coding! 🚀
