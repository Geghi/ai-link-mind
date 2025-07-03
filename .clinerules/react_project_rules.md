# Next.js Project Rules (with App Router)

## 1. Project Structure

The project follows the Next.js App Router conventions for a clean, scalable, and route-centric architecture.

```
src/
├── app/                 # Application routes, layouts, and pages
│   ├── (api)/           # API Route Handlers (e.g., /api/...)
│   ├── (main)/          # Main application routes group
│   │   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # Shared/reusable components (Client & Server)
│   ├── ui/              # Base UI (Button, Input) - mostly "use client"
│   └── common/          # Common business components
├── lib/                 # Utility functions, external library configs
├── hooks/               # Custom hooks (for Client Components)
├── types/               # Global TypeScript definitions
└── constants/           # App constants and configs
```

### Rules:
1.  **Src Directory**: All application code, including the `app` directory, resides within the `src` directory.
2.  **App Router First**: All routes must be defined within the `src/app` directory using `page.tsx`, `layout.tsx`, etc.
3.  **Route Groups**: Use route groups `(folderName)` to organize routes and layouts without affecting the URL path.
4.  **Server Components by Default**: All components inside the `app` directory are Server Components by default. Only use `"use client"` when necessary.
5.  **Consistent Naming**: Use kebab-case for directories and route segments. Use PascalCase for component files.

## 2. Component Design

### Rules:
1.  **Server vs. Client Components**:
    *   **Server Components (Default)**: Use for data fetching, accessing backend resources (databases, APIs), and keeping sensitive logic off the client. They cannot use hooks like `useState` or `useEffect`.
    *   **Client Components (`"use client"`)**: Use for interactivity, browser-only APIs (e.g., `localStorage`), and state management with hooks. Keep them as small and specific as possible.
3.  **Page/Layout Exports**: Pages (`page.tsx`) and Layouts (`layout.tsx`) must use a `default` export.
4.  **Reusable Components**: Reusable components should use named exports for better tree-shaking and clarity.
5.  **Component Size**: Maximum 150 lines per component file. Extract complex logic into hooks or utilities.


## 3. State Management

### Rules:
1.  **Server-Side Data Fetching**: Use `fetch()` in Server Components for server state. Next.js automatically handles caching and revalidation.
2.  **Client-Side Data Fetching**: Use libraries like SWR or React Query within Client Components for mutations or real-time data that cannot be handled on the server.
3.  **URL State**: Use the URL (`searchParams`) to manage state that should be bookmarkable and shareable, like filters or search queries.
4.  **Client-Side Global State**: For UI state (e.g., theme, modals), use `Context + useReducer/useState`. The context provider must be in a Client Component.
5.  **No Prop Drilling**: Maximum 2 levels of prop passing before using context or component composition.

## 4. Performance Optimization

### Rules:
1.  **Automatic Code Splitting**: Next.js handles route-based code splitting automatically.
2.  **Image Optimization**: Always use the `<Image>` component from `next/image` for automatic optimization, resizing, and modern format delivery.
3.  **Font Optimization**: Use `next/font` to load local or Google Fonts efficiently, preventing layout shifts.
4.  **Streaming with Suspense**: Wrap slow data-fetching components or UI sections in `<Suspense>` to stream UI to the client, improving perceived load times.
5.  **Dynamic Imports**: Use `next/dynamic` to lazy-load Client Components or heavy libraries that are not immediately needed.
6.  **Bundle Analysis**: Regularly use `@next/bundle-analyzer` to inspect bundle sizes and identify optimization opportunities.

```typescript
// ✅ Streaming with Suspense
import { Suspense } from 'react';
import { PostFeed, PostFeedSkeleton } from '@/components/PostFeed';

export default function PostsPage() {
  return (
    <section>
      <h1>All Posts</h1>
      <Suspense fallback={<PostFeedSkeleton />}>
        <PostFeed />
      </Suspense>
    </section>
  );
}
```

## 5. Next.js Core Concepts

### Routing
*   **File-System Based**: Routes are defined by the folder structure in `src/app`.
*   **Special Files**:
    *   `page.tsx`: The UI for a route segment.
    *   `layout.tsx`: Shared UI for a segment and its children.
    *   `loading.tsx`: Instant loading state UI, shown while content loads.
    *   `error.tsx`: Catches and displays errors for a segment.
    *   `template.tsx`: Similar to a layout, but re-mounts on navigation.

### Data Fetching
*   **`fetch` API**: The native `fetch` API is extended in Server Components for caching and revalidation control.
*   **Caching Strategies**:
    *   `cache: 'force-cache'`: (Default) Caches data indefinitely.
    *   `next: { revalidate: 3600 }`: Incremental Static Regeneration (ISR). Revalidates at most every hour.
    *   `cache: 'no-store'`: Server-Side Rendering (SSR). Fetches data on every request.

### Metadata API
*   **SEO Optimization**: Use the `generateMetadata` function in layouts and pages to define `title`, `description`, and other meta tags. This is a server-only function.

```typescript
// ✅ Metadata Example
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return {
    title: product.title,
    description: product.description,
  };
}
```

### Route Handlers
*   **API Endpoints**: Create API endpoints by adding a `route.ts` file inside a route segment (e.g., `app/api/users/route.ts`).
*   **HTTP Methods**: Export named functions for HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).

## 6. Accessibility (WCAG 2.1 AA)

(This section remains largely the same as standard React, but is still critical.)

### Rules:
1.  **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`).
2.  **ARIA Labels**: Add `aria-label` or `aria-labelledby` to interactive elements.
3.  **Focus Management**: Ensure visible focus indicators and logical tab order.
4.  **Color Contrast**: Minimum 4.5:1 ratio for normal text.
5.  **Keyboard Navigation**: All interactive elements must be accessible via keyboard.

## 7. Tailwind CSS Styling

### Rules:
1.  **Utility-First**: Prefer utilities over custom CSS.
2.  **Component Classes**: Use `@apply` sparingly, for repeated utility combinations that form a clear component variant.
3.  **Responsive Design**: Mobile-first breakpoint usage (`sm:`, `md:`, `lg:`).
4.  **Conditional Classes**: Use a utility like `clsx` or `cn` for conditional styling.
5. **Custom Properties**: Extend Tailwind config for brand-specific values
6. **Class Organization**: Group by category (layout → spacing → colors → typography)
7. **Conditional Classes**: Use `clsx` or `cn` utility for conditional styling
8.  **Component Library**: Use `shadcn-ui` for all UI components.

## 8. UI/UX Design System

### Visual Identity Rules:
1. **Glassmorphism**: Use backdrop-blur effects for depth and modernity
2. **Gradient Accents**: Bold gradients for CTAs and highlights
3. **Micro-animations**: Smooth transitions on all interactive elements (200-300ms)
4. **Dark Mode Ready**: Design with dark/light theme support
5. **3D Elements**: Subtle shadows and elevation for depth perception
6. **Typography Scale**: Consistent type scale with emphasis hierarchy

### Component Design Patterns:
1. **Floating Elements**: Cards and modals with subtle shadows and rounded corners
2. **Interactive Feedback**: Hover states, loading states, and success animations
3. **Spatial Relationships**: Generous whitespace and clear visual grouping
4. **Brand Colors**: Primary, Secondary, Accent
5. **Iconography**: Consistent icon library (Lucide React)

```typescript
// ✅ Modern UI Pattern
const PropertyCard = ({ property }: { property: PropertyData }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      {/* Card content */}
    </div>
  </div>
);
```

### Animation Guidelines:
1. **Page Transitions**: Stagger animations for list items
2. **Loading States**: Skeleton screens with shimmer effects
3. **Success States**: Confetti or checkmark animations
4. **Error States**: Subtle shake animations
5. **Scroll Animations**: Intersection Observer for reveal animations

### Mobile-First UX:
1. **Touch Targets**: Minimum 44px for interactive elements
2. **Thumb Navigation**: Important actions within thumb reach
3. **Swipe Gestures**: Implement where intuitive (card dismissal)
4. **Progressive Enhancement**: Works without JavaScript
