# Skill: ERP data (records & relations)

Use when reading/writing records, filter/sort, relation links, or mapping `RecordDto` → UI DTOs.

Load [erp.md](./erp.md) + [erp-schema.md](./erp-schema.md). Reference: `../miniapp-workshop/src/lib/erp/records.ts`, `src/lib/api/*.ts`.

## ObjectHandle

Address fields by **display name** (or key) — the SDK resolves them. Use `F.*` constants from `schema.ts`; do not scatter hardcoded strings.

```ts
const { objects } = await getErp();
const page = await objects.factory
  .records()
  .where(F.factory.name, "contains", "A")
  .orderBy(F.factory.name, "asc")
  .limit(50)
  .withTotal()
  .fetch(); // { records, nextCursor, hasMore, total }

const all = await objects.factory.records().fetchAll();
const created = await objects.factory.create({ [F.factory.name]: "Plant 1" });
await objects.factory.update(created.id, { [F.factory.name]: "Plant 1b" });
```

Operators: `equals`, `not_equals`, `contains`, `greater_than`, `greater_than_or_equal`, `less_than`, `less_than_or_equal`, `is_empty`, `is_not_empty`.  
Server limits: 20 filters, 3 sorts, 100 records/page.

```ts
const row = handle.rowFromRecord(record); // columns = display names
```

## Relations

**`relation` values are not in `record.data`** — they live in the links table.

```ts
// read
const targets = await handle.listLinks(recordId, fieldName);
const first = targets[0]?.targetRecordId ?? null;

// set exactly one target (diff links)
await setRelation(handle, recordId, fieldName, targetIdOrNull);
```

Standard helpers (from workshop `records.ts`): `relationTarget`, `relationTargets`, `setRelation`, `setRelations`, `readRelations`, `incomingRecordIds`, `getRecords`, `writable`.

`writable(row)` — `""` → `null` (typed columns reject empty strings).

Create + link:

```ts
const record = await handle.create(writable(scalarFields));
await setRelations(handle, record.id, { [F.line.factory]: factoryId });
```

## Service layer

Domain logic lives in `src/lib/api/<domain>.ts` (server-only): take `erp` from context, return DTOs from `src/domain/types.ts` / `src/lib/domain/types.ts`. Never call `erp-sdk` from client hooks.

```ts
// app/api/factories/route.ts
export const GET = withErp(async ({ erp }) => listFactories(erp));
```

Mutations: validate body (zod if present) → write ERP → return DTO. Client: toast + invalidate React Query ([page.md](./page.md)).

## DataFrame (optional)

```ts
const df = await handle.records().toFrame();
df.groupBy("Customer").agg({ total: ["sum", "Amount"] }).head(5).toArray();
```

## Common errors

| Error | Fix |
| --- | --- |
| `UnknownFieldError` | `bunx erp objects show "<Object>"` — `.known` lists valid fields |
| `ErpApiError` 403 | key permissions / row scope |
| update conflict | pass `version`, or let the SDK read first |
