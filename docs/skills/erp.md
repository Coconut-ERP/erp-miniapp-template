# Skill: ERP SDK (boot & wiring)

Use when the task mentions `erp-sdk`, `createMiniApp`, `ERP_API_KEY`, `schema.json`, initData, reading/writing ERP records, or wiring seed APIs to the ERP backend.

**Always load this first**, then the focused skill:

| Task | Skill |
| --- | --- |
| `schema.json` / `assertSchema` / field names | [erp-schema.md](./erp-schema.md) |
| Query / create / update / relation links | [erp-data.md](./erp-data.md) |
| initData, session, `X-Init-Data` | [erp-session.md](./erp-session.md) |

Full SDK surface / CLI: [erp/references/api.md](./erp/references/api.md), [erp/references/cli.md](./erp/references/cli.md).  
Upstream package skill (after install): `node_modules/erp-sdk/skills/erp-miniapp/SKILL.md`.

Reference implementation: `../miniapp-workshop` (`src/lib/erp/*`, `src/lib/api/route.ts`, `src/lib/client/*`).

## Hard rules

1. **API key stays on the server** — `ERP_API_KEY` / `erp_sk_…` only in `src/lib/erp/` and route handlers. Never in client components; never commit `.env*`.
2. **Browser → app backend → ERP** — the client calls the mini app `/api/*`; the server uses `erp-sdk`.
3. **Do not declare `object:create` / `object:field:create`** in `permissions` — the mini app is a `member`; tables are declared in `schema.json` and applied by the deployer.
4. **Inspect the real schema before coding** — `bunx erp doctor`, `bunx erp objects list|show`, `bunx erp schema dump`. Do not guess object/field names.
5. **App authority by default** — write with the service account; use `session(initData)` only to learn `user.id`. Switch to user authority only when per-user IAM must be enforced.

## Env

```bash
cp .env.local.example .env.local
# ERP_BASE_URL=…
# ERP_API_KEY=erp_sk_…
```

On Mini App deploy, the platform injects `ERP_BASE_URL`, `ERP_API_KEY`, `ERP_WORKSPACE_ID`, and `PORT`.

## Folder layout (when wiring ERP)

```text
schema.json                 # ships with source (generated from declaration)
scripts/schema.ts           # writes schema.json from src/lib/erp/schema.ts
src/lib/erp/
  app.ts                    # createMiniApp + getErp() singleton
  schema.ts                 # OBJECTS, F, declaration()
  provision.ts              # assertSchema → ObjectHandle map
  session.ts                # resolveUser(initData) + cache
  records.ts                # relation helpers, writable(), getRecords
src/lib/api/route.ts        # withApi → withErp (initData + getErp)
src/lib/client/
  init-data.ts              # read / request initData from host
  api.ts                    # fetch + X-Init-Data + 401 retry
```

## Boot (`src/lib/erp/app.ts`)

```ts
import { createMiniApp, type ErpClient, type RequiredPermission } from "erp-sdk";

const PERMISSIONS: RequiredPermission[] = [
  { resource: "object", action: "read" },
  { resource: "object:field", action: "read" },
  { resource: "object:record", action: "read" },
  { resource: "object:record", action: "create" },
  { resource: "object:record", action: "update" },
  // add delete only when the app truly deletes records
];

let booting: Promise<{ app: ErpClient; objects: … }> | null = null;

export function getErp() {
  if (!booting) {
    booting = boot().catch((e) => {
      booting = null; // do not memoize a failed boot
      throw e;
    });
  }
  return booting;
}
```

`createMiniApp` checks IAM at boot and throws `MissingPermissionsError` if rights are missing.

## Route wrapper

Every API route: read `X-Init-Data` → `resolveUser` → `getErp` → handler. Map SDK errors in `errorResponse` (`MissingPermissionsError`, `UnknownObjectError`, `ErpApiError`; 401 → FE refreshes initData).

## Quick debug

| Symptom | Action |
| --- | --- |
| `MissingPermissionsError` at boot | `bunx erp doctor --require object:record:create`, then grant IAM |
| `UnknownFieldError` / `UnknownObjectError` | `bunx erp objects show\|list`; declare/apply `schema.json` |
| `SchemaMismatchError` | `bunx erp schema check` |
| App installed but no build | `schemaStatus: "pending"` — schema must be approved |
| 401 exchanging initData | expired (~5 min) / wrong service account / user left workspace |
| Reads return 0 rows | IAM row scope — `bunx erp perms list` |
