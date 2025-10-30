# Project Architecture Documentation

## Overview

This project uses a **Feature-First architecture** optimized for AI-assisted development. Each feature is self-contained with all related code (components, hooks, services, types) organized together.

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   ├── (main)/                   # Main app route group
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── features/                     # Feature modules
│   ├── auth/                     # Example: Auth feature
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth-specific hooks
│   │   ├── services/             # Auth API services
│   │   ├── types/                # Auth types
│   │   └── store/                # Auth state management
│   │
│   └── [feature]/                # Other features follow same pattern
│
└── shared/                       # Reusable code
    ├── components/               # Generic UI components (Button, Card, etc.)
    ├── hooks/                    # Generic hooks (useDebounce, useLocalStorage)
    ├── stores/                   # Global app state (Zustand)
    ├── types/                    # Shared types (api.ts, domain.ts)
    ├── utils/                    # Utility functions (error-handler, validators)
    ├── lib/                      # External lib configs (supabase.ts)
    ├── constants/                # App constants
    ├── styles/                   # Global styles (Tailwind)
    └── assets/                   # Images, icons, fonts
```

## Key Principles

### 1. Feature-First Organization
Each feature is completely self-contained:
- **Components**: UI specific to this feature
- **Hooks**: State logic specific to this feature
- **Services**: API calls for this feature
- **Types**: Domain types specific to this feature
- **Store**: Local state management for this feature

### 2. Shared Code
Code in `src/shared/` is reusable across features:
- Generic components (Button, Card)
- Generic hooks (useDebounce, useLocalStorage)
- Global state (app-store)
- Shared types and utilities
- External library configurations

### 3. Path Aliases
Use path aliases defined in `tsconfig.json`:
```typescript
import { Button } from '@/shared/components';
import { useAuth } from '@/features/auth/hooks';
import { ROUTES } from '@/shared/constants';
```

## File Conventions

### Naming
- **Folders**: `kebab-case` (e.g., `auth-service`)
- **Files**: `kebab-case` (e.g., `login-form.tsx`)
- **Components**: `PascalCase` (e.g., `LoginForm`)
- **Functions/Variables**: `camelCase` (e.g., `handleLogin`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_URL`)

### Size Limits
- **Files**: Max 500 lines
- **Functions**: Max 50 lines
- **Components**: One responsibility

## Adding a New Feature

To add a new feature `video-editor`:

```bash
mkdir -p src/features/video-editor/{components,hooks,services,types,store}
```

Create index files for each folder:
```typescript
// src/features/video-editor/components/index.ts
export { EditorCanvas } from './editor-canvas';

// src/features/video-editor/hooks/index.ts
export { useEditor } from './use-editor';

// src/features/video-editor/services/index.ts
export { editorService } from './editor-service';

// src/features/video-editor/types/index.ts
export type { EditorState, EditorConfig } from './editor-types';
```

## State Management Strategy

### Local State
Use React's `useState` for component-local state:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Feature State
Use Zustand for feature-specific state (`src/features/[feature]/store/`):
```typescript
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### Global State
Use Zustand for app-wide state (`src/shared/stores/`):
```typescript
export const useAppStore = create((set) => ({
  isDarkMode: false,
  setIsDarkMode: (value) => set({ isDarkMode: value }),
}));
```

## API Integration

All API calls should be in feature `services/`:

```typescript
// src/features/auth/services/auth-service.ts
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
};
```

## Error Handling

Use the centralized error handler:

```typescript
import { ErrorHandler } from '@/shared/utils';

try {
  await someApi();
} catch (error) {
  const appError = ErrorHandler.handle(error);
  console.error(appError.message);
}
```

## Testing

### Unit Tests
Tests for individual functions/components:
```bash
npm run test
```

### Structure
Tests should mirror source structure:
```
src/features/auth/hooks/useAuth.ts
src/features/auth/hooks/__tests__/useAuth.test.ts
```

## Performance Considerations

1. **Code Splitting**: Next.js automatically splits code by route
2. **Lazy Loading**: Use `dynamic()` for components
   ```typescript
   import dynamic from 'next/dynamic';
   const HeavyComponent = dynamic(() => import('./heavy'), { ssr: false });
   ```
3. **Memoization**: Use `React.memo()` for expensive renders
4. **State Optimization**: Keep state as local as possible

## IDE Integration with Claude Code

This architecture is optimized for:
- **Quick Navigation**: All feature code in one folder
- **Context Understanding**: AI can see entire feature at once
- **Consistent Patterns**: Same structure for each feature
- **Scalability**: Add features without touching existing code

---

For detailed information on development practices, see [CLAUDE.md](/CLAUDE.md)
