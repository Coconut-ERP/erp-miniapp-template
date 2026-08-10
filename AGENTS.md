# AGENTS.md — miniapp-ui-kit

Reference mini app for `@erp/miniapp-ui`. Clone as a starting layout for ERP mini apps.

## Skills (load first)

Before generating or reviewing UI, **read the matching skill** under `docs/skills/` and **fetch `@erp/miniapp-ui` docs via MCP** (`coconut-erp-ui` — see below). Do not invent conventions or component APIs that contradict those sources.

| When | Skill |
| --- | --- |
| Shell, sidebar, canvas, or custom color | [docs/skills/styling.md](docs/skills/styling.md) |
| New feature / domain component | [docs/skills/component.md](docs/skills/component.md) |
| New route / page orchestration | [docs/skills/page.md](docs/skills/page.md) — also add `docs.md` beside `page.tsx` |
| Reusable pattern composition | [docs/skills/pattern.md](docs/skills/pattern.md) |
| Follow an existing recipe | [docs/skills/recipe.md](docs/skills/recipe.md) |
| Review UI quality | [docs/skills/review.md](docs/skills/review.md) |
| Accessibility review | [docs/skills/accessibility-review.md](docs/skills/accessibility-review.md) |
| Performance review | [docs/skills/performance-review.md](docs/skills/performance-review.md) |
| Replace local UI with library | [docs/skills/refactor.md](docs/skills/refactor.md) |
| ERP boot / `createMiniApp` / wire backend | [docs/skills/erp.md](docs/skills/erp.md) |
| `schema.json` / `assertSchema` | [docs/skills/erp-schema.md](docs/skills/erp-schema.md) |
| Records, relations, ObjectHandle | [docs/skills/erp-data.md](docs/skills/erp-data.md) |
| initData / session / `X-Init-Data` | [docs/skills/erp-session.md](docs/skills/erp-session.md) |

Index: [docs/skills/README.md](docs/skills/README.md)  
Engineering conventions: [docs/conventions/](docs/conventions/)  
Copy-ready recipes: [docs/recipes/](docs/recipes/)

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
8. API keys / ERP credentials stay server-side (`lib/erp`, `lib/api`, route handlers). Never in client components.
9. Data layer: `erp-sdk` only on the server. FE talks to app `/api/*` with `X-Init-Data`; see [docs/skills/erp.md](docs/skills/erp.md).

## Folder layout

```text
schema.json               # mini-app table declaration (when wired to ERP)
scripts/schema.ts         # generate schema.json from src/lib/erp/schema.ts
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
    api/                  # server domain services + route helpers
    erp/                  # createMiniApp, schema, session, records (ERP only)
    client/               # browser fetch + initData bridge
    date.ts
  domain/types.ts         # DTOs
```

## Commands

```bash
bun install
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run schema            # regenerate schema.json from src/lib/erp/schema.ts
bunx erp doctor           # env + ERP connectivity (needs .env.local)
```

## MCP UI docs (`coconut-erp-ui`)

For `@erp/miniapp-ui` **components, props, patterns, and foundations** — call MCP first. Do not infer APIs from memory, other libraries, or by grepping package source.

| Step | MCP tool | When |
| --- | --- | --- |
| 1 | `list-all-documentation` | Start of any UI task — discover component and doc IDs |
| 2 | `get-documentation` | Before using a component or answering prop/API questions — returns stories, usage snippets, and TypeScript props |
| 3 | `get-documentation-for-story` | A prop or variant is not shown in the first 3 stories |
| 4 | `get-storybook-story-instructions` | Before creating or editing `*.stories.*` files |
| 5 | `get-stories-by-component` / `get-changed-stories` | After UI changes — find affected stories (needs Storybook dev server) |
| 6 | `preview-stories` | After visual changes — verify in Storybook (include preview URLs in the response) |

**Hard rules for MCP**

- Never assume a prop exists — if MCP docs do not show it, it does not exist; say so instead of guessing.
- Use only IDs returned by `list-all-documentation` (e.g. `ui-button`, `patterns-pageheader`, `foundations-colors--docs`).
- MCP covers library UI; app-specific conventions stay in [docs/conventions/](docs/conventions/) and [docs/recipes/](docs/recipes/).

## Library docs

App engineering conventions and copy-ready flows: [docs/conventions/](docs/conventions/) and [docs/recipes/](docs/recipes/).

When wiring ERP data, follow [docs/skills/erp.md](docs/skills/erp.md) and the reference app `../miniapp-workshop`.
