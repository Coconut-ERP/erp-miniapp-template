# AGENTS.md — miniapp-ui-kit

Reference mini app for `@erp/miniapp-ui`. Clone as a starting layout for ERP mini apps.

## Skills (load first)

Before generating or reviewing UI, **read the matching skill** under `skills/`. Do not invent conventions that contradict those files.

| When | Skill |
| --- | --- |
| Shell, sidebar, canvas, or custom color | [skills/styling.md](skills/styling.md) |
| New feature / domain component | [skills/component.md](skills/component.md) |
| New route / page orchestration | [skills/page.md](skills/page.md) |
| Reusable pattern composition | [skills/pattern.md](skills/pattern.md) |
| Follow an existing recipe | [skills/recipe.md](skills/recipe.md) |
| Review UI quality | [skills/review.md](skills/review.md) |
| Accessibility review | [skills/accessibility-review.md](skills/accessibility-review.md) |
| Performance review | [skills/performance-review.md](skills/performance-review.md) |
| Replace local UI with library | [skills/refactor.md](skills/refactor.md) |

Index: [skills/README.md](skills/README.md)

## Hard rules

1. Import UI from `@erp/miniapp-ui` only — no local `components/ui` / shadcn forks.
2. `app/**/page.tsx` is a **Server Component** (no `"use client"`). Interactive UI → `src/components/page/*-page.tsx`.
3. Domain UI (cards, forms, tables, sections) → `src/components/features/`. Keep `*-page.tsx` as orchestration (hooks, early returns, layout).
4. Copy (titles, empty, errors) → `src/constants/` (e.g. `pages.ts`). Shared helpers → `src/lib/` (e.g. `date.ts`).
5. Page body: **early returns** — loading → error → empty → success (one branch only). Use `PageHeader` + loading/empty/error/permission states.
6. Mutations: toast + invalidate React Query.
7. **Colors**
   - Library components: semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-surface`, …).
   - App chrome (shell/sidebar/canvas): Tailwind classes **inline** on elements.
   - Never: `--app-*` CSS vars, `bg-[var(--…)]`, color palette `const` objects.
8. API keys / ERP credentials stay server-side (`lib/api`, route handlers). Never in client components.

## Folder layout

```text
src/
  app/                    # routes + app/api/*
  components/
    page/                 # *-page.tsx (client orchestration)
    features/             # domain cards, forms, tables
    app-shell.tsx
    providers.tsx
  constants/              # nav.ts, pages.ts (copy only)
  hooks/                  # React Query
  lib/
    api/                  # server logic + seed.ts
    client/api.ts         # browser fetch
    date.ts
  domain/types.ts         # DTOs
```

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Library docs

When composing `@erp/miniapp-ui`, read package docs under `../../packages/miniapp-ui/docs/` (components, foundations, conventions, patterns, recipes) before inventing APIs.
