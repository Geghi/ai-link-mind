# Real Estate Chatbot MVP - React Project Rules

## 1. Project Structure

```
src/
├── components/          # Shared/reusable components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   └── common/         # Common business components
├── lib/               # External library configurations
├── hooks/             # Global custom hooks
├── services/          # Global API services
├── types/             # Global TypeScript definitions
├── utils/             # Global utility functions
├── constants/         # App constants and configs
└── styles/           # Global styles and Tailwind configs
```

### Rules:
4. **No Deep Nesting**: Maximum 3 levels deep in any directory structure
5. **Consistent Naming**: Use kebab-case for directories, PascalCase for components

## 2. Component Design

### Rules:
1. **Single Responsibility**: Each component handles one concern only
2. **Prop Interface First**: Define TypeScript interfaces before implementation
3. **Composition over Inheritance**: Use component composition patterns
4. **No Logic in JSX**: Extract complex logic to custom hooks or utilities
5. **Default Props**: Use default parameters, not `defaultProps`
6. **Ref Forwarding**: Forward refs for all interactive components
7. **Component Size**: Maximum 150 lines per component file
8. **Named Exports**: Use named exports for better tree-shaking

```typescript
// ✅ Good Component Pattern
interface SearchBoxProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  ({ onSubmit, placeholder = "Ask about any property...", isLoading = false }, ref) => {
    const { query, handleSubmit } = useSearchBox(onSubmit);
    
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        {/* Component JSX */}
      </form>
    );
  }
);
```

## 3. Code Quality & Style

### ESLint Rules:
1. **Strict TypeScript**: `@typescript-eslint/strict` configuration
2. **React Hooks**: Enforce hooks rules and dependencies
3. **Import Order**: Alphabetical with group separation (external → internal → relative)
4. **Unused Variables**: Error on unused variables/imports
5. **Console Statements**: Warn on console.log, error on console.error in production

### Prettier Configuration:
1. **Line Length**: 100 characters maximum
2. **Semicolons**: Always use semicolons
3. **Quotes**: Single quotes for JS/TS, double quotes for JSX
4. **Trailing Commas**: Always use trailing commas
5. **Tab Width**: 2 spaces

### Naming Conventions:
1. **Components**: PascalCase (`SearchInterface`)
2. **Hooks**: camelCase with `use` prefix (`useRealEstateData`)
3. **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS`)
4. **Functions**: camelCase (`processQuery`)
5. **Types/Interfaces**: PascalCase (`PropertyData`, `SearchResponse`)

## 4. State Management

### Local State Rules:
1. **useState for Simple**: Use `useState` for primitive values and simple objects
2. **useReducer for Complex**: Use `useReducer` for complex state logic
3. **Custom Hooks**: Extract stateful logic into custom hooks
4. **State Co-location**: Keep state as close to usage as possible

### Global State Rules:
1. **React Query**: Use for server state management (API data, caching)
2. **Context + useReducer**: For client-side global state (user settings, theme)
3. **No Prop Drilling**: Maximum 2 levels of prop passing before using context
4. **State Normalization**: Normalize nested data structures

```typescript
// ✅ State Management Pattern
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { mutate: sendMessage } = useMutation({
    mutationFn: processQuery,
    onSuccess: (response) => {
      setMessages(prev => [...prev, response]);
    }
  });
  
  return { messages, isLoading, sendMessage };
};
```

## 5. Performance Optimization

### Rules:
1. **Lazy Loading**: Use `React.lazy()` for route-based code splitting
2. **Memoization**: Use `useMemo` for expensive calculations only
3. **Callback Memoization**: Use `useCallback` for functions passed to children
4. **List Optimization**: Use `key` props with stable IDs, not array indices
5. **Image Optimization**: Use Next.js Image component with proper sizing
6. **Bundle Analysis**: Regular bundle size analysis and tree-shaking verification
7. **Virtual Scrolling**: Implement for lists >100 items
8. **Debounced Inputs**: Debounce search inputs (300ms minimum)

```typescript
// ✅ Performance Pattern
const SearchResults = memo(({ results }: { results: PropertyResult[] }) => {
  const sortedResults = useMemo(
    () => results.sort((a, b) => b.score - a.score),
    [results]
  );
  
  return (
    <div className="space-y-4">
      {sortedResults.map(result => (
        <PropertyCard key={result.id} property={result} />
      ))}
    </div>
  );
});
```

## 6. Accessibility (WCAG 2.1 AA)

### Rules:
1. **Semantic HTML**: Use proper HTML elements (`<button>`, `<nav>`, `<main>`)
2. **ARIA Labels**: Add `aria-label` or `aria-labelledby` to interactive elements
3. **Focus Management**: Visible focus indicators and logical tab order
4. **Color Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
5. **Keyboard Navigation**: All interactive elements accessible via keyboard
6. **Screen Reader**: Test with screen readers, provide meaningful alt text
7. **Form Labels**: Associate all form inputs with labels
8. **Error States**: Clear error messages with `aria-describedby`

```typescript
// ✅ Accessibility Pattern
<button
  type="submit"
  aria-label="Search for property information"
  aria-describedby={error ? "search-error" : undefined}
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  disabled={isLoading}
>
  {isLoading ? "Searching..." : "Search Property"}
</button>
```

## 7. Tailwind CSS Styling

### Rules:
1. **Utility-First**: Prefer utilities over custom CSS
2. **Component Classes**: Use `@apply` for repeated utility combinations
3. **Responsive Design**: Mobile-first breakpoint usage (`sm:`, `md:`, `lg:`)
4. **Design Tokens**: Use Tailwind's design system (spacing, colors, typography)
5. **Custom Properties**: Extend Tailwind config for brand-specific values
6. **Class Organization**: Group by category (layout → spacing → colors → typography)
7. **Conditional Classes**: Use `clsx` or `cn` utility for conditional styling

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