# LinkMindAI Next.js Project Standard (Condensed)

A mandatory guide for a scalable, performant, and maintainable codebase, built on predictability and separation of concerns.

---

## Ⅰ. Core Philosophy

1.  **Server-First**: Default to Server Components. Use `"use client"` only for interactivity or browser APIs.
2.  **Client Components at Leaves**: Keep Client Components small and isolated. Pass Server Components to them as `children` props.
3.  **Server-Side Logic**: All data fetching and business logic must execute on the server.
4.  **URL is State**: Use URL `searchParams` for any bookmarkable state (e.g., filters, tabs).
5.  **Strict Conventions**: Adhere to these rules strictly to maintain predictability.
6.  **Simplicity and Clarity**: Write simple, readable code. Keep functions short and focused; refactor long functions into smaller, reusable ones.

---

## Ⅱ. Project Structure

A clear, scalable structure with separation of concerns.

```
src/
├── app/
│   ├── api/                 # API Route Handlers
│   ├── dashboard/           # Route-specific components/layouts
│   └── page.tsx             # Homepage
│   ├── layout.tsx           # Root Layout
│   └── globals.css
├── components/
│   ├── ui/                  # Shadcn UI components
│   └── common/              # Shared simple components (Header)
├── lib/
│   └── utils.ts             # `cn()` and other utilities
├── hooks/                   # Custom Client-Side hooks
├── types/                   # Global TypeScript definitions
└── services/                # Third-party API integrations (Supabase, OpenAI)
```

---

## Ⅲ. Component Architecture

### A. Component Type
- **Server Component**: For data fetching or backend access.
- **Client Component (`"use client"`)**: For hooks (`useState`, etc.) and browser APIs.

### B. Server/Client Contract
**Rule**: Never import Server Components into Client Components. Pass them as `children` props instead.


### C. Design Rules
1.  **Single Responsibility**: Components do one thing well.
3.  **Size Limit**: Max 150 lines per component. Refactor if larger.
4.  **Exports**: `default` for pages/layouts, `named` for all other components.
5.  **Props**: Use explicit TypeScript types and destructure.

---

## Ⅳ. State Management
1.  **Server State**: Handle with Server Components, Server Actions, or Route Handlers.
2.  **URL State**: Use `useRouter` and `useSearchParams` for persistent client state.
3.  **UI State**: Use `useState` for local state. Use **Zustand** for global state (modals, theme).
4.  **Form State**: Use `react-hook-form` with a Zod resolver for validation.

---

## Ⅵ. TypeScript
1.  **Strict Mode**: `tsconfig.json` must have `"strict": true`.
2.  **Be Explicit**: Always define types for function arguments, return values, and API boundaries.
3.  **Zod for Validation**: Validate all external data (API inputs, forms) with Zod.
4.  **Naming**: `PascalCase` for types/interfaces (e.g., `type UserProfile`), `ComponentNameProps` for props.

---

## Ⅶ. APIs & Server Actions
- **Server Actions First**: Prefer Server Actions for data mutations (`POST`, `PUT`, `DELETE`).
- **Route Handlers**: Use for webhooks or dedicated API endpoints for client-side fetchers.
- **Validation**: All API inputs must be validated with Zod.
- **Standard Response**: Use a consistent JSON response shape (`{ data, error }`).

---

## Ⅷ. Performance
1.  **Suspense for Streaming**: Aggressively use `<Suspense>` with skeleton loaders for data-fetching components.
2.  **`next/image`**: Always use for image optimization.
3.  **`next/font`**: Always use for font optimization.
4.  **`next/dynamic`**: Lazy-load non-critical, heavy Client Components.
5.  **No Premature Memoization**: Use `memo`, `useCallback`, `useMemo` only after profiling identifies a bottleneck.

---

## Ⅸ. UI/UX Design System

For all tasks related to UI, UX, styling, or component design, refer to the detailed guidelines in the `.clinerules/optional/design_system_rules.md` file. This document contains specific rules on visual language, animations, styling, and component structure.

---

## X. Notifications

For all user-facing notifications, use the following Shadcn UI components:

*   **Toasts**: Use the `sonner` component for all toast messages. This component is available via the `useToast` hook.
*   **Alerts/Confirms**: Use the `AlertDialog` component for all alert and confirm messages. This component is available via the `useAlertDialog` hook.

Under no circumstances should you use the default TypeScript `alert()` and `confirm()` functions.

### **Maintaining Project Context**

**These context files are living documents and must be kept current.** It is mandatory to update them immediately following any significant change to the project to ensure the documentation remains the single source of truth.

**When to Update:**
*   **Structural Changes:** If you add a new directory (e.g., `src/lib/analytics`), you must update the `Project Structure` diagram.
*   **Data Model Changes:** If you create a new Supabase table, you must update the data model documentation and add a corresponding migration file in `supabase/migrations/`.
*   **Workflow Modifications:** Any change to the user or data flow described in `project_context.md` must be documented.

Proactively keeping these files synchronized with the codebase is a core development responsibility.
