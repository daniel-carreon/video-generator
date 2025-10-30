# Quick Start Guide

## Setup (First Time Only)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be at `http://localhost:3000`

## Daily Development Commands

### Start Development
```bash
npm run dev
```

### Run Tests
```bash
npm run test           # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Code Quality
```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Fix linting issues
npm run typecheck     # Check TypeScript types
npm run format        # Format code with Prettier
```

### Build & Deploy
```bash
npm run build         # Build for production
npm run preview       # Preview production build locally
npm run start         # Start production server
```

## Project Structure Quick Reference

```
src/
├── app/                    # Next.js pages and routes
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── (auth)/            # Auth routes
│   └── (main)/            # Main app routes
│
├── features/              # Feature modules (add new features here)
│   ├── [feature]/
│   │   ├── components/    # Feature components
│   │   ├── hooks/         # Feature hooks
│   │   ├── services/      # API calls
│   │   ├── types/         # TypeScript types
│   │   ├── store/         # State management
│   │   └── index.ts       # Public exports
│
└── shared/                # Reusable code
    ├── components/        # Generic UI (Button, Card, etc.)
    ├── hooks/             # Shared hooks (useDebounce, etc.)
    ├── stores/            # Global state (useAppStore)
    ├── types/             # Shared types
    ├── utils/             # Utilities (error-handler, validators)
    ├── lib/               # Configs (supabase.ts)
    ├── constants/         # App constants
    ├── styles/            # Global CSS
    └── assets/            # Images, icons, etc.
```

## Creating Your First Feature

### 1. Generate Feature Structure
```bash
mkdir -p src/features/my-feature/{components,hooks,services,types,store}
```

### 2. Create Type Definition
**File:** `src/features/my-feature/types/index.ts`
```typescript
export interface MyFeatureState {
  isLoading: boolean;
  error: string | null;
}
```

### 3. Create Zustand Store
**File:** `src/features/my-feature/store/my-feature-store.ts`
```typescript
import { create } from 'zustand';

export const useMyFeatureStore = create((set) => ({
  isLoading: false,
  error: null,
  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),
}));
```

### 4. Create Service
**File:** `src/features/my-feature/services/my-feature-service.ts`
```typescript
export const myFeatureService = {
  getAll: async () => {
    const response = await fetch('/api/my-feature');
    return response.json();
  },
};
```

### 5. Create Hook
**File:** `src/features/my-feature/hooks/use-my-feature.ts`
```typescript
import { useMyFeatureStore } from '../store';
import { myFeatureService } from '../services';

export function useMyFeature() {
  const { isLoading, setLoading, setError } = useMyFeatureStore();

  const fetch = async () => {
    setLoading(true);
    try {
      return await myFeatureService.getAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, fetch };
}
```

### 6. Create Component
**File:** `src/features/my-feature/components/my-component.tsx`
```typescript
import { Card } from '@/shared/components';

interface Props {
  title: string;
}

export function MyComponent({ title }: Props) {
  return <Card><h2>{title}</h2></Card>;
}
```

### 7. Export Everything
**File:** `src/features/my-feature/index.ts`
```typescript
export * from './components';
export * from './hooks';
export * from './services';
export * from './store';
export * from './types';
```

### 8. Use Your Feature
```typescript
import { MyComponent } from '@/features/my-feature';
import { useMyFeature } from '@/features/my-feature';

export default function Page() {
  const { isLoading } = useMyFeature();
  return <MyComponent title="Hello" />;
}
```

## Common Tasks

### Add a New Page
1. Create route: `src/app/(main)/my-route/page.tsx`
2. Create layout if needed: `src/app/(main)/my-route/layout.tsx`
3. Import components from features

### Add a New Component to Shared
1. Create: `src/shared/components/my-component.tsx`
2. Export in: `src/shared/components/index.ts`
3. Use everywhere: `import { MyComponent } from '@/shared/components'`

### Add Global State
1. Create: `src/shared/stores/my-store.ts`
2. Export in: `src/shared/stores/index.ts`
3. Use: `import { useMyStore } from '@/shared/stores'`

### Add Environment Variable
1. Add to `.env.example`
2. Add to `.env.local`
3. Use: `process.env.NEXT_PUBLIC_MY_VAR` (client) or `process.env.MY_VAR` (server)

## Debugging Tips

### Check TypeScript Errors
```bash
npm run typecheck
```

### Check Linting Issues
```bash
npm run lint
```

### Check Tests
```bash
npm run test
```

### View Network Requests
Use browser DevTools → Network tab

### View Console Errors
Use browser DevTools → Console tab

## Git Workflow Quick Start

```bash
# Create feature branch
git checkout -b feature/TICKET-123-description

# Make changes, test, commit
git add .
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/TICKET-123-description

# Create PR on GitHub
# After approval and merge, delete branch
git checkout develop && git pull
git branch -d feature/TICKET-123-description
```

## Performance Tips

1. Use `React.memo()` for expensive components
2. Use `useCallback()` to prevent function re-creation
3. Lazy load heavy components with `dynamic()`
4. Keep state as local as possible
5. Use Zustand for shared state only

## Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure info
2. Check [FEATURE_TEMPLATE.md](./FEATURE_TEMPLATE.md) for detailed feature guide
3. See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for git guidelines
4. Review [CLAUDE.md](/CLAUDE.md) for development principles

---

Happy coding! 🚀
