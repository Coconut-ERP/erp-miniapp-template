# `erp` CLI — reference

Ships with `erp-sdk` (`npx erp …`, or `erp` when installed globally).
Results are **always JSON on stdout**; notes and errors are JSON on stderr.
Exit codes: `0` OK, `1` runtime/API error, `2` usage error.

`erp help --json` returns the full command surface as machine-readable JSON —
prefer that over guessing command names.

## Connection

| Flag | Env | Meaning |
| --- | --- | --- |
| `--base-url <url>` | `ERP_BASE_URL` | ERP base URL (SDK appends `/api/v1`) |
| `--api-key <erp_sk_…>` | `ERP_API_KEY` | Service-account key |
| `--token <jwt>` | `ERP_ACCESS_TOKEN` | User access token (instead of key) |
| `--workspace <id>` | `ERP_WORKSPACE_ID` | Only with `--token` |
| `--env-file <path>` | — | Load KEY=VALUE from file; real env still wins |
| `--compact` | — | Single-line JSON |

## Commands

```
erp doctor [--require resource:action]…   env + connectivity + rights → {ok, checks[]}
erp whoami                                identity + effective permissions
erp perms list | perms check <resource> <action>

erp objects list [--fields]
erp objects show <object>
erp objects create <name> [--position n]
erp objects ensure <name> [--field "Name:type[:config]"]…   # admin key
erp objects delete <object> --yes

erp fields types
erp fields add <object> <name> <type> [--config json] [--position n]
erp fields update <object> <field> [--name x] [--config json] [--position n] [--archive]

erp records query <object> [--where …]… [--sort …]… [--limit n] [--cursor c]
                           [--all] [--max n] [--total] [--select "A,B"] [--by name|key] [--raw]
erp records count <object> [--where …]…
erp records get <object> <id>
erp records create <object> [--data json] [--set "Field=value"]…
erp records update <object> <id> [--data json] [--set …]… [--version n]
erp records delete <object> <id> [--version n]
erp records restore <object> <id> --version n

erp links list <object> <id> <field> [--direction outgoing|incoming]
erp links add <object> <id> <field> <target-id> [--position n]
erp links remove <object> <id> <field> <target-id>

erp schema dump [--out file]                    dump workspace (objects + fields)
erp schema check [file] [--offline]             validate schema.json: syntax + diff (exit 1 on issues)
erp schema init [file] [--object name]… [--force]   export existing objects to schema.json
erp init [dir] [--name x] [--object x] [--sdk spec] [--force]
erp skill install [--dir path] [--force] | erp skill path
erp help [command] [--json]
```

## Value syntax

**Filter** — `--where "Field:operator:value"`, or `--where "Field=value"`
(shorthand for `equals`). Operators: `equals`, `not_equals`, `contains`,
`greater_than`, `greater_than_or_equal`, `less_than`, `less_than_or_equal`,
`is_empty`, `is_not_empty` (last two need no value). Repeat `--where` = AND.

**Sort** — `--sort "Field:desc"` (default `asc`), max 3.

**Assign** — `--set "Field=value"` (repeatable) or `--data '{"Field":…}'`.

**Coercion**: strings that parse as JSON become JSON (`42` → number, `true` →
boolean, `null` → null); otherwise string (`approved`, `2026-08-03`). For an
exact string like `"42"`, use `--data`.

**Field spec** for `objects ensure` — `"Name:type"`, `"Name:type:{json config}"`,
or select shorthand: `"Status:single_select:pending,approved,rejected"`.

## Examples

```bash
# Explore before coding
erp doctor --require object:record:create
erp schema dump --out workspace.json

# Declare tables for a mini app (the app CANNOT create them itself)
erp schema check                       # syntax + workspace diff
erp schema check --offline             # syntax only, no credentials
erp schema init --object "Leave request"   # export an existing object

# Provision with an admin key (tooling, not the mini app)
erp objects ensure "Leave request" \
  --field "Requester:single_select:{\"source\":\"workspace_users\"}" \
  --field "Reason:long_text" \
  --field "From date:date" \
  --field "Status:single_select:pending,approved,rejected"

# Read
erp records query "Leave request" --where "Status=pending" --sort "From date:desc" --limit 20
erp records query "Invoice" --where "Amount:greater_than:1000000" --all --select "Customer,Amount"
erp records count "Leave request" --where "Status=pending"

# Write
erp records create "Leave request" --set "Reason=Family matter" --set "From date=2026-08-03"
erp records update "Leave request" <id> --set "Status=approved"

# With jq
erp records query "Invoice" --all --compact | jq '.records | length'
```

## Errors

Errors print to stderr as `{"error":{…}}` with `type` and hints:

| `type` | Meaning |
| --- | --- |
| `UsageError` | Bad syntax / missing args (exit 2) |
| `MissingPermissionsError` | Key lacks rights — `.missing` lists `resource:action` pairs |
| `SchemaMismatchError` | Workspace ≠ `schema.json` — `.missing`, `.conflicts`; run `erp schema check` |
| `UnknownObjectError` | No such object — run `erp objects list` |
| `UnknownFieldError` | No such field — `.known` lists valid fields |
| `ErpApiError` | Backend non-2xx — `.status`, `.trace`, `.details` |
