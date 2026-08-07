# MiniApp UI Kit (reference)

Reference **mini app layout** for `@erp/miniapp-ui` — clone this project as a starting point.

## Install

Uses published `@erp/miniapp-ui` **v0.2.0** (GitHub Release tarball).

```bash
bun install
bun run dev
```

Lint / format (Biome, same as `examples/miniapp-hr`):

```bash
bun run lint
bun run format
bun run typecheck
```

## Folder layout (standard)

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

See `packages/miniapp-ui/docs/conventions/folder.md`.

## Demo routes

| URL | Pattern |
| --- | --- |
| `/` | Redirect → `/dashboard` |
| `/dashboard` | HRM dashboard (Dreams ERP layout) |
| `/table` | CRUD table (+ Performance / Payments panels) |
| `/requests/new` | Multi-step form → `POST /api/service-requests` |

## Wire ERP

1. Replace `lib/api/seed.ts` reads with `lib/erp` + record queries (see `examples/miniapp-workshop`).
2. Add initData to `lib/client/api.ts` when embedding in ERP.
3. Keep UI copy in `constants/` — never in components.

## Rules

- Import UI from `@erp/miniapp-ui` only — no local `components/ui`.
- API keys stay server-side in `lib/erp` / route handlers.
- Styling: `skills/styling.md`. Agent entry: `AGENTS.md` / `CLAUDE.md`.
