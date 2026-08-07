# erp-sdk — API surface

Node 18+ (global `fetch`). ESM + CJS. `import { … } from "erp-sdk"`.

## Init

```ts
createMiniApp(config): Promise<ErpClient>
// config: { baseUrl, apiKey?, accessToken?, workspaceId?, permissions?, fetch? }
```

Requires `apiKey` (`erp_sk_…`) **or** `accessToken`. With `permissions`, IAM is
checked at boot → `MissingPermissionsError`. An API key is pinned to its
workspace; `workspaceId` is not required.

## ErpClient

| Method | Notes |
| --- | --- |
| `me(refresh?)` | Current user (service-account keys may have none) |
| `myPermissions(refresh?)` | Effective permissions, cached |
| `can(resource, action)` | Fast preflight; deny wins over allow; `manage` does not imply other actions |
| `assertPermissions(extra?)` | Throws `MissingPermissionsError` if missing |
| `objects(refresh?)` | List objects |
| `object(nameOrId)` | `ObjectHandle` (loads fields, cached) |
| `hasObject(nameOrId)` | boolean |
| `assertSchema(schema, { refresh? })` | **Mini-app table check**: match `schema.json` → `Record<objectName, ObjectHandle>`; mismatch → `SchemaMismatchError` |
| `schemaPlan(schema, { refresh? })` | Same diff as the review UI, no throw → `SchemaObjectPlan[]` |
| `createObject(name, { position? })` | Empty table — **admin key**; mini apps lack this right |
| `ensureObject(name, fields[])` | Idempotent create table + fields (admin key, tooling) |
| `deleteObject(nameOrId)` | Delete table (admin key) |
| `issueInitData(serviceAccountId)` | Host app: issue signed string |
| `session(initData)` | Mini app: verified `{ user, client, expiresIn }` |
| `asUser(accessToken, workspaceId?)` | Client under the user’s rights |
| `invalidate()` | Clear all caches |

## ObjectHandle

`id`, `name`, `fields`, `field(nameOrKey)`, `fieldKey(nameOrKey)`

```ts
handle.records()                      // → RecordQuery
handle.create(data)                   // keys by display name or field key
handle.get(id)
handle.update(id, data, version?)     // omit version → SDK reads first
handle.delete(id, version?)           // soft delete
handle.restore(id, version)
handle.addField(name, type, { config?, position? })
handle.updateField(nameOrKey, { name?, config?, position?, isArchived? })
handle.rename(name)
handle.createLink(recordId, field, targetId, position?)
handle.listLinks(recordId, field, direction?)
handle.deleteLink(recordId, field, targetId)
handle.rowFromRecord(record, by?)     // RecordDto → flat row (columns = field names)
```

`addField` / `updateField` / `rename` also need an admin key — mini apps only
read metadata and read/write records.

Field types: `text`, `long_text`, `number`, `currency`, `percent`, `checkbox`,
`date`, `datetime`, `single_select`, `multi_select`, `url`, `email`, `phone`,
`relation`, `lookup`, `rollup`, `formula`, `attachment`. Computed types
(`formula`, `lookup`, `rollup`) **cannot be declared** in `schema.json`.

## schema.json helpers (pure, no network)

```ts
interface MiniAppSchema { objects: { name: string; position?: number;
  fields?: { name: string; type: string; config?: object; position?: number }[] }[] }

type SchemaStatus = "none" | "pending" | "applied";
type SchemaAction = "create" | "update" | "unchanged" | "conflict";
```

| Export | Notes |
| --- | --- |
| `validateSchema(value)` | `string[]` of upload-time errors; empty = valid |
| `planSchema(schema, workspace)` | Offline diff (`workspace`: `{ name, fields: [{ name, type }] }[]`) |
| `schemaSettled(plans)` / `schemaConflicts(plans)` | Nothing left to apply / type conflicts |
| `unresolvedRelations(schema, workspace)` | Relations pointing at missing objects |
| `schemaSize(schema)` · `relationTarget(field)` · `defineSchema(schema)` | Utilities |
| `SCHEMA_FILE` · `FIELD_TYPES` · `DECLARABLE_FIELD_TYPES` · `COMPUTED_FIELD_TYPES` | Constants |
| `MAX_SCHEMA_BYTES` (256KB) · `MAX_SCHEMA_OBJECTS` (50) · `MAX_SCHEMA_FIELDS` (200) · `MAX_NAME_LENGTH` (255) | Limits |

## RecordQuery (chainable)

```ts
.where(field, operator, value?)   // max 20
.orderBy(field, "asc" | "desc")   // max 3
.limit(n)                          // server max 100
.cursor(c) .withTotal()
await .fetch()                     // { records, nextCursor, hasMore, total? }
await .fetchAll({ max? })          // auto-paginate
await .first() / .count()
await .toFrame({ by?, max? })      // → DataFrame
```

## DataFrame

Immutable; every method returns a new frame. Columns = field **display names**
(plus `id`, `version`, `createdAt`, `updatedAt`, and computed fields).

`filter`, `where`, `map`, `forEach`, `select`, `rename`, `sortBy`, `unique`,
`uniqueBy`, `pluck`, `head`, `tail`, `slice`, `first`, `last`, `at`, `sum`,
`avg`, `min`, `max`, `count`, `isEmpty`, `countBy`, `keyBy`,
`groupBy().agg()/count()/sum()/avg()`, `leftJoin`, `toArray`.

```ts
df.groupBy("Customer")
  .agg({ revenue: ["sum", "Amount"], orders: ["count"] })
  .sortBy("revenue", "desc").head(5).toArray();
```

## initData bridge (browser)

```ts
readInitDataFromLocation()                  // #erpInitData=… or ?erpInitData=…
receiveInitData({ allowedOrigins, timeoutMs? })   // postMessage; "*" rejected
sendInitDataToFrame(target, initData, targetOrigin)  // host side
parseInitData(initData)                     // UNVERIFIED — display only
INIT_DATA_MESSAGE_TYPE  // "erp-miniapp:init-data"
INIT_DATA_URL_PARAM     // "erpInitData"
```

## Errors

| Class | Useful fields |
| --- | --- |
| `MissingPermissionsError` | `.missing` |
| `SchemaMismatchError` | `.missing`, `.conflicts` (`{ object, field?, type?, currentType? }`) |
| `ErpApiError` | `.status`, `.trace`, `.details` |
| `UnknownObjectError` | `.object` |
| `UnknownFieldError` | `.field`, `.objectName`, `.known` |
