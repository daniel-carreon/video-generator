# Feature Template Guide

## Quick Start: Creating a New Feature

Use this guide to create a new feature following the Feature-First architecture.

### 1. Create the Feature Directory Structure

```bash
mkdir -p src/features/[feature-name]/{components,hooks,services,types,store}
```

### 2. Create Type Definitions

**File:** `src/features/[feature-name]/types/index.ts`

```typescript
/**
 * [Feature Name] Types
 */

export interface [FeatureName]State {
  // Define feature state shape
  isLoading: boolean;
  error: string | null;
}

export interface [FeatureName]Config {
  // Define feature configuration
}
```

### 3. Create Zustand Store

**File:** `src/features/[feature-name]/store/[feature-name]-store.ts`

```typescript
import { create } from 'zustand';
import type { [FeatureName]State } from '../types';

interface Store extends [FeatureName]State {
  // Define store actions
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export const use[FeatureName]Store = create<Store>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
```

**File:** `src/features/[feature-name]/store/index.ts`

```typescript
export { use[FeatureName]Store } from './[feature-name]-store';
```

### 4. Create API Service

**File:** `src/features/[feature-name]/services/[feature-name]-service.ts`

```typescript
import { ApiResponse } from '@/shared/types';
import type { [FeatureName]State } from '../types';

export const [featureName]Service = {
  getAll: async (): Promise<ApiResponse<[FeatureName]State>> => {
    try {
      const response = await fetch('/api/[feature-name]');
      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch [feature-name]: ${error}`);
    }
  },

  create: async (data: any): Promise<ApiResponse<[FeatureName]State>> => {
    try {
      const response = await fetch('/api/[feature-name]', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      throw new Error(`Failed to create [feature-name]: ${error}`);
    }
  },
};
```

**File:** `src/features/[feature-name]/services/index.ts`

```typescript
export { [featureName]Service } from './[feature-name]-service';
```

### 5. Create Hooks

**File:** `src/features/[feature-name]/hooks/use-[feature-name].ts`

```typescript
import { useCallback, useEffect } from 'react';
import { use[FeatureName]Store } from '../store';
import { [featureName]Service } from '../services';

export function use[FeatureName]() {
  const { isLoading, error, setLoading, setError } = use[FeatureName]Store();

  const fetch[FeatureName] = useCallback(async () => {
    setLoading(true);
    try {
      const response = await [featureName]Service.getAll();
      if (!response.success) {
        setError(response.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    isLoading,
    error,
    fetch[FeatureName],
  };
}
```

**File:** `src/features/[feature-name]/hooks/index.ts`

```typescript
export { use[FeatureName] } from './use-[feature-name]';
```

### 6. Create Components

**File:** `src/features/[feature-name]/components/[component-name].tsx`

```typescript
import { ReactNode } from 'react';
import { Card } from '@/shared/components';
import type { [FeatureName]Config } from '../types';

interface [ComponentName]Props {
  config: [FeatureName]Config;
  children?: ReactNode;
}

export function [ComponentName]({ config, children }: [ComponentName]Props) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">{config.title}</h2>
      {children}
    </Card>
  );
}
```

**File:** `src/features/[feature-name]/components/index.ts`

```typescript
export { [ComponentName] } from './[component-name]';
```

### 7. Create Feature Index

**File:** `src/features/[feature-name]/index.ts`

```typescript
/**
 * [Feature Name] Feature
 */

export * from './components';
export * from './hooks';
export * from './services';
export * from './store';
export * from './types';
```

## Usage Example

After creating your feature, use it like this:

```typescript
import { [ComponentName] } from '@/features/[feature-name]';
import { use[FeatureName] } from '@/features/[feature-name]';

export function MyComponent() {
  const { isLoading, fetch[FeatureName] } = use[FeatureName]();

  return (
    <[ComponentName] config={{ /* ... */ }}>
      {isLoading ? <p>Loading...</p> : <p>Ready</p>}
    </[ComponentName]>
  );
}
```

## Best Practices

1. **Keep it isolated**: Feature code should not import from other features
2. **Use services for APIs**: All API calls go in services folder
3. **Use stores for state**: Complex state goes in Zustand stores
4. **Type everything**: Always define TypeScript interfaces
5. **Error handling**: Always handle errors in services and hooks
6. **Testing**: Create `__tests__` folder with matching test files

## File Size Guidelines

- Files: Max 500 lines
- Functions: Max 50 lines
- Components: One responsibility

---

For architectural decisions, see [ARCHITECTURE.md](./ARCHITECTURE.md)
