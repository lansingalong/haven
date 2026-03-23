# Code Review

Review the Haven project (or a specific file/component if specified) for code quality, correctness, and design system compliance.

## What to check

### Design system compliance
- [ ] No hardcoded hex values, font sizes, or spacing — only `var(--token-name)` references
- [ ] No Tailwind classes
- [ ] All CSS in `.module.css` files (no inline styles except where unavoidable)
- [ ] Icons from `@mui/icons-material` or inline SVG — no emoji
- [ ] Named exports only — no `export default` on components

### Component conventions
- [ ] `ComponentNameProps` interface defined and exported
- [ ] CSS class names in camelCase
- [ ] All interactive states handled: default, hover, focus, pressed, disabled, error
- [ ] New components exported from `src/components/index.ts`

### React correctness
- [ ] No missing dependency array entries in `useEffect`/`useMemo`/`useCallback`
- [ ] No array/object literals created inline inside render (use `useMemo` for stable refs)
- [ ] Timer/subscription cleanup in `useEffect` return functions
- [ ] `disabled` attribute wired on all CTA buttons
- [ ] Controlled inputs have both `value` and `onChange`

### Accessibility
- [ ] Interactive elements are focusable and have visible focus rings
- [ ] ARIA roles/labels on non-semantic elements (comboboxes, listboxes, dialogs)
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Form inputs have associated `<label>` elements

### TypeScript
- [ ] No `any` types (use `unknown` or proper types)
- [ ] Props interface covers all component props
- [ ] Event handlers are typed correctly

## Scope

$ARGUMENTS
