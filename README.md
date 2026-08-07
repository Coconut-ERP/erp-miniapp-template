# MiniApp UI Kit (reference)

Reference **mini app layout** for `@erp/miniapp-ui` — clone this project as a starting point.

- UI: [`@erp/miniapp-ui`](https://github.com/Coconut-ERP/erp-miniapp-ui)
- ERP: [`erp-sdk`](https://github.com/Coconut-ERP/erp-sdk) — see [`skills/erp.md`](skills/erp.md) and `src/lib/erp/*`
- Agent entry: [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md)

## Install

```bash
bun install
cp .env.local.example .env.local   # ERP_BASE_URL + ERP_API_KEY when wiring ERP
bun run dev
```

```bash
bun run lint
bun run format
bun run typecheck
bun run schema          # regenerate schema.json from src/lib/erp/schema.ts
```

## Folder layout

```text
schema.json
scripts/schema.ts
src/
  app/                    # routes + app/api/* + per-route docs.md
  components/
    page/                 # *-page.tsx (client orchestration)
    features/             # domain cards, forms, tables
    app-shell.tsx
    providers.tsx
  constants/              # copy only
  hooks/                  # React Query
  lib/
    api/                  # server domain + withApi / withErp
    erp/                  # createMiniApp, schema, session, records
    client/               # browser fetch + initData
    date.ts
  domain/types.ts         # DTOs
```

`page.tsx` is a Server Component; interactive UI lives in `src/components/page/`.  
Copy → `src/constants/`; dates → `src/lib/date.ts`.  
Layout: left sidebar (desktop) + drawer (mobile) — `AppShell`.

## Pages

Each route ships a **`docs.md`** next to `page.tsx` so agents know purpose, files, API, and `seed` vs `wired` status.

| Route | Purpose | Docs |
| --- | --- | --- |
| `/` | Redirect → `/dashboard` | — |
| `/dashboard` | HRM dashboard reference (static) | [`src/app/dashboard/docs.md`](src/app/dashboard/docs.md) |
| `/table` | In-memory CRUD table + side panels | [`src/app/table/docs.md`](src/app/table/docs.md) |
| `/sites` | Sites list dashboard (seed API) | [`src/app/sites/docs.md`](src/app/sites/docs.md) |
| `/sites/[id]` | Site detail + nested members | [`src/app/sites/[id]/docs.md`](src/app/sites/[id]/docs.md) |
| `/requests/new` | Multi-step service-request form | [`src/app/requests/new/docs.md`](src/app/requests/new/docs.md) |
| `/pipeline` | Redirect → `/table` | — |

Sidebar nav (`src/constants/nav.ts`): `/dashboard`, `/table`, `/requests/new`.

## API

| Method | Path | Used by | Backend |
| --- | --- | --- | --- |
| `GET` | `/api/me` | — | ERP (`withErp`) |
| `GET` | `/api/sites` | `/sites` | seed (`withApi`) |
| `GET` | `/api/sites/:id` | `/sites/[id]` | seed |
| `GET` | `/api/service-requests/options` | `/requests/new` | seed |
| `POST` | `/api/service-requests` | `/requests/new` | seed mock |

## Wire ERP

1. Extend `src/lib/erp/schema.ts` → `bun run schema`.
2. Replace seed reads in `lib/api/*` with `getErp()` / `erp.objects.*` (see `skills/erp-data.md`).
3. Switch route wrappers from `withApi` to `withErp`; keep client `api()` (initData already wired).
4. Update the page’s `docs.md` status to `wired`.

## Rules

- Import UI from `@erp/miniapp-ui` only — no local `components/ui`.
- API keys stay server-side in `lib/erp` / route handlers.
- New route → add `docs.md` + README row ([`skills/page.md`](skills/page.md)).
- Styling: [`skills/styling.md`](skills/styling.md).
