# AGENTS.md - Development Guidelines for UpTask Frontend

This document provides comprehensive guidelines for AI agents working on the UpTask React/TypeScript frontend project. It covers build commands, code style conventions, and development practices.

## Build, Lint, and Test Commands

### Primary Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build` (runs TypeScript compilation + Vite build)
- **Lint code**: `npm run lint` (runs ESLint on all files)
- **Preview production build**: `npm run preview`

### Testing

**Note**: This project does not currently have a test framework configured. When adding tests:

- Consider using Vitest (already uses Vite) or Jest
- Add test scripts to package.json
- Create tests in `__tests__/` directories or alongside source files with `.test.tsx` extension

### Pre-commit Hooks

- Pre-commit hooks run `npx lint-staged`
- Automatically lints and formats staged files:
  - `eslint --fix` on TypeScript/JavaScript files
  - `prettier --write --ignore-unknown` on TypeScript/JavaScript and config files

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- **Target**: ES2020
- **JSX**: `react-jsx` (no `.jsx` extension needed)
- **Module resolution**: `bundler` mode for Vite compatibility

### Import Organization

```typescript
// 1. External libraries (React, third-party)
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

// 2. Internal absolute imports using @/ aliases
import { authenticateUser } from "@/api/auth-api";
import ErrorMessage from "@/components/ErrorMessage";

// 3. Type imports
import type { UserLoginForm } from "@/types/index";
```

### Path Aliases

Use the following `@/` path mappings:

- `@/components/*` → `src/components/*`
- `@/layouts/*` → `src/layouts/*`
- `@/views/*` → `src/views/*`
- `@/api/*` → `src/api/*`
- `@/types/*` → `src/types/*`
- `@/lib/*` → `src/lib/*`
- `@/utils/*` → `src/utils/*`
- `@/locales/*` → `src/locales/*`
- `@/hooks/*` → `src/hooks/*`

### Naming Conventions

#### Files and Directories

- **Components**: PascalCase (e.g., `TaskCard.tsx`, `LoginView.tsx`)
- **API files**: kebab-case with `-api` suffix (e.g., `auth-api.ts`, `task-api.ts`)
- **Types**: `index.ts` in types directory
- **Utilities**: kebab-case (e.g., `utils.ts`, `policies.ts`)
- **Directories**: kebab-case (e.g., `auth/`, `projects/`, `components/`)

#### Code Elements

- **Components**: PascalCase function names
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE (rarely used)
- **Types**: PascalCase
- **Enums**: PascalCase (when used)

### Type Definitions

#### Zod Schema Pattern

```typescript
import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
export type UserFormData = Pick<User, "name" | "email">;
```

- Define schemas in `src/types/index.ts`
- Use `z.infer<>` to create TypeScript types
- Use `Pick<>` for form data types
- Validate API responses with `schema.safeParse()`

### Component Patterns

#### Functional Components with TypeScript

```typescript
type ComponentNameProps = {
  requiredProp: string;
  optionalProp?: number;
};

export default function ComponentName({ requiredProp, optionalProp }: ComponentNameProps) {
  // Component logic
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Hooks Usage

- Use React Query for server state: `useQuery`, `useMutation`
- Use React Hook Form for form state: `useForm`
- Custom hooks in `src/hooks/` directory

### API Layer

#### API Function Pattern

```typescript
export async function functionName(formData: FormType) {
  try {
    const url = "endpoint/path";
    const { data } = await api.post<ResponseType>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.error);
    }
  }
}
```

- Use centralized `api` instance from `@/lib/axios`
- Consistent error handling with `isAxiosError` checks
- Throw `Error` objects with user-friendly messages

### Error Handling

#### API Error Pattern

```typescript
try {
  // API call
} catch (error) {
  if (isAxiosError(error) && error.response) {
    throw new Error(error.response.data.error);
  }
  throw new Error("Unexpected error message");
}
```

#### Component Error Handling

- Use `toast.error()` for user notifications
- Handle form validation errors through React Hook Form
- Use optional chaining and nullish coalescing

### Styling

#### Tailwind CSS Classes

- Use utility-first approach
- Consistent spacing with Tailwind scale
- Custom color palette (fuchsia for primary actions)
- Responsive design with `sm:`, `md:`, `lg:` prefixes

#### Class Organization

```typescript
className={`base-classes ${conditionalClasses ? 'additional-classes' : ''} ${dynamicClass}`}
```

### State Management

#### Server State (React Query)

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["resource", id],
  queryFn: () => fetchResource(id),
});

const { mutate } = useMutation({
  mutationFn: updateResource,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resource"] }),
  onError: (error) => toast.error(error.message),
});
```

#### Form State (React Hook Form)

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormType>({
  defaultValues: initialValues,
});
```

### File Structure

```
src/
├── api/           # API functions
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── lib/           # Utilities and configurations
├── locales/       # Internationalization
├── types/         # TypeScript type definitions
├── utils/         # Helper functions
└── views/         # Page-level components
```

### Code Quality Checks

#### Always run these before committing:

1. `npm run lint` - ESLint checks
2. `npm run build` - TypeScript compilation
3. Manual testing of functionality

#### ESLint Rules

- React hooks rules enabled
- TypeScript recommended rules
- Prettier integration for formatting
- React refresh plugin for hot reload optimization

### Security Best Practices

- Never commit sensitive data (API keys, tokens)
- Use environment variables for configuration
- Validate all user inputs with Zod schemas
- Use HTTPS in production
- Implement proper authentication flows

### Performance Considerations

- Use React Query for caching server state
- Implement proper loading states
- Use React.memo for expensive components when needed
- Optimize bundle size by code splitting
- Use lazy loading for routes

### Git Workflow

- Pre-commit hooks automatically format and lint code
- Use descriptive commit messages
- Follow conventional commit format when possible
- Create feature branches for new work
- Use pull requests for code review

---

## Quick Reference

### Creating a new component:

1. Create file in appropriate directory with PascalCase name
2. Define props interface with TypeScript
3. Use functional component pattern
4. Export as default

### Adding a new API endpoint:

1. Add function to appropriate `-api.ts` file
2. Follow the established error handling pattern
3. Add types to `src/types/index.ts`
4. Use the centralized axios instance

### Running the project:

````bash
npm install    # Install dependencies
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Check code quality
```</content>
<parameter name="filePath">/home/aaronmasm/Courses/Curso-React/uptask_mern/uptask_frontend/AGENTS.md
````
