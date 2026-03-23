# Build a Feature

You are building a new feature for the Haven care management chat assistant.

## Before you start

1. Read `DESIGN_SYSTEM.md` — understand token rules, component conventions, and naming
2. Read `src/tokens/variables.css` — know all available CSS custom properties
3. Check `src/components/index.ts` — see what components are already built
4. Look at the screenshot context (if provided) to understand where this feature lives in the UI

## Rules

- **No Tailwind** — all styles go in `.module.css` files using CSS custom properties
- **No hardcoded colors/sizes** — always use `var(--token-name)` in CSS
- **Named exports only** — no `export default` for components
- **Props interface** — every component needs a `ComponentNameProps` interface
- **All 6 states** — implement: `default` → `hover` → `focus` → `pressed` → `disabled` → `error`
- **Icons** — use `@mui/icons-material` or inline SVG, never emoji
- **Exports** — add every new component to `src/components/index.ts`

## File structure for new components

```
src/components/
  ComponentName/
    ComponentName.tsx        ← component + types
    ComponentName.module.css ← scoped styles
    index.ts                 ← re-export (optional)
```

## What to build

$ARGUMENTS
