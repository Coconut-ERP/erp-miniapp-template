# Skill: ERP session (initData)

Use when authenticating the user in a mini app, bridging host ↔ iframe, sending `X-Init-Data`, or handling 401 refresh.

Load [erp.md](./erp.md). Reference: `../miniapp-workshop/src/lib/erp/session.ts`, `src/lib/client/init-data.ts`, `src/lib/client/api.ts`, `src/lib/api/route.ts`.

## Two sides

| Side | Role |
| --- | --- |
| Host (ERP) | `issueInitData(miniAppServiceAccountId)` → deliver to the frame (`#erpInitData=` or postMessage) |
| Mini app FE | read / request initData → send `X-Init-Data` on every request |
| Mini app BE | `app.session(initData)` → verified `{ user, client, expiresIn }` |

`parseInitData()` / reading the URL is **unverified** — display only. Trust identity only after `session()`.

## Authority

- **App authority (default)**: write with the service account; use `user.id` for fields / “mine only” filters.
- **User authority**: `session(initData).client` or `asUser` — every call follows the user’s IAM; 403 if the user lacks rights.

initData lasts ~5 minutes; session ~15 minutes; no refresh token — ask the host again when expired.

## Server (`session.ts` + `route.ts`)

```ts
export const INIT_DATA_HEADER = "x-init-data";

async function identify(request: NextRequest): Promise<UserDto> {
  const initData = request.headers.get(INIT_DATA_HEADER);
  if (!initData) throw unauthorized("Missing initData — open the app from ERP");
  return resolveUser(initData);
}

// resolveUser: cache by initData string, TTL = expiresIn - 60s; never cache forever
```

`withErp` / `withWorkshop`: identify → `getErp()` → handler. On 401, the FE requests fresh initData and retries.

## Client bridge (`init-data.ts`)

```ts
const URL_PARAM = "erpInitData";
const INIT_DATA_MESSAGE = "erp-miniapp:init-data";
const REQUEST_MESSAGE = "erp-miniapp:request-init-data";

// 1) read hash/query
readInitDataFromLocation();

// 2) or ask the host
window.parent.postMessage({ type: REQUEST_MESSAGE }, "*");
// wait for message type INIT_DATA_MESSAGE + initData
```

Embed mount path: `/apps/<slug>-<id>/` — use `appBase()` / `appUrl(path)` so `fetch` hits the correct prefix. Local `next dev` → `/`.

SDK `receiveInitData({ allowedOrigins })` **rejects `"*"`**. The workshop pattern (postMessage + verify on the BE) lets one build run across workspaces.

## Client API (`api.ts`)

```ts
// every fetch: X-Init-Data header
// 401 → ensureInitData(forceRefresh=true) → retry once
```

Never ship `ERP_API_KEY` to the browser. Never log initData or session tokens.

## Local dev

No host → no initData → API returns 401. Open the app from ERP, or (tooling only) mock a session deliberately — do not bypass with a client-side key.
