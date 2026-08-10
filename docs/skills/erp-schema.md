# Skill: ERP schema

Use when declaring or changing tables/fields for a mini app (`schema.json`, `assertSchema`, `defineSchema`, object/field names).

Load [erp.md](./erp.md) first. Reference: `../miniapp-workshop/src/lib/erp/schema.ts` + `scripts/schema.ts`.

## Rules

1. **The app does not create tables** — declare them in `schema.json`; the deployer `apply`s with their own rights.
2. **Single source of truth** — `src/lib/erp/schema.ts` (`declaration()`) generates `schema.json`. Do not edit `schema.json` by hand and drift from code.
3. **Cannot declare** `formula` / `lookup` / `rollup` in schema — create those by hand in the workspace; the app may `console.warn` if missing.
4. Relation targets use the **object display name**: `config: { targetObject: "Customer" }`.
5. Names ≤255 chars, ≤50 objects, ≤200 fields/object, file ≤256KB. Call `validateSchema()` before writing the file.

## Declaration pattern

```ts
import { defineSchema, type MiniAppSchema } from "erp-sdk";

export const OBJECTS = {
  factory: "Factory",
  line: "Line",
} as const;

export const F = {
  factory: { name: "Name" },
  line: { name: "Name", factory: "Factory" },
} as const;

export function declaration(): MiniAppSchema {
  return defineSchema({
    objects: [
      {
        name: OBJECTS.factory,
        position: 0,
        fields: [{ name: F.factory.name, type: "text", position: 0 }],
      },
      {
        name: OBJECTS.line,
        position: 1,
        fields: [
          { name: F.line.name, type: "text", position: 0 },
          {
            name: F.line.factory,
            type: "relation",
            config: { targetObject: OBJECTS.factory },
            position: 1,
          },
        ],
      },
    ],
  });
}
```

Declarable field types: `text`, `long_text`, `number`, `currency`, `percent`, `checkbox`, `date`, `datetime`, `single_select`, `multi_select`, `url`, `email`, `phone`, `relation`, `attachment`.

Static select:

```ts
{ name: "Status", type: "single_select",
  config: { source: "static", options: ["pending", "approved"] } }
```

Workspace users:

```ts
{ name: "Owner", type: "single_select",
  config: { source: "workspace_users" } }
```

## Generate + check

```ts
// scripts/schema.ts
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchema } from "erp-sdk";
import { declaration } from "../src/lib/erp/schema";

const schema = declaration();
const problems = validateSchema(schema);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
writeFileSync(resolve(import.meta.dirname, "../schema.json"), `${JSON.stringify(schema, null, 2)}\n`);
```

```bash
bun run schema                 # write schema.json
bunx erp schema check          # syntax + workspace diff
bunx erp schema check --offline
bunx erp schema init --object "Factory"   # export an existing object
```

Add to `package.json`: `"schema": "bun run scripts/schema.ts"`.

## Boot resolve (`provision.ts`)

```ts
const byName = await app.assertSchema(declaration());
// match → Record<objectName, ObjectHandle>
// mismatch → SchemaMismatchError (.missing, .conflicts)
```

Missing lookups → warn, do not throw (they are not in `schema.json`).

## Deploy

- Zip keeps `schema.json`, excludes `node_modules`.
- `schemaStatus: "pending"` → no build yet; needs `POST …/schema/apply`.
- Type conflict → fix workspace or declaration, then apply again.
