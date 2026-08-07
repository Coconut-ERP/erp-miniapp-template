# AI skills

Load the relevant skill before generating or reviewing UI / ERP wiring.  
Entry points for agents: root [`AGENTS.md`](../AGENTS.md) / [`CLAUDE.md`](../CLAUDE.md).

## UI (`@erp/miniapp-ui`)

| Skill | When |
| --- | --- |
| [styling.md](./styling.md) | Shell, sidebar, canvas, or any custom color in mini apps |
| [component.md](./component.md) | New feature/domain component |
| [page.md](./page.md) | New route / page orchestration |
| [pattern.md](./pattern.md) | Reusable pattern composition |
| [recipe.md](./recipe.md) | Follow an existing recipe |
| [review.md](./review.md) | Review UI quality |
| [accessibility-review.md](./accessibility-review.md) | Accessibility review |
| [performance-review.md](./performance-review.md) | Performance review |
| [refactor.md](./refactor.md) | Replace local UI with `@erp/miniapp-ui` |

## ERP (`erp-sdk`)

| Skill | When |
| --- | --- |
| [erp.md](./erp.md) | Boot `createMiniApp`, permissions, folder layout, debug |
| [erp-schema.md](./erp-schema.md) | `schema.json`, `declaration()`, `assertSchema` |
| [erp-data.md](./erp-data.md) | Records, filters, relations, service layer |
| [erp-session.md](./erp-session.md) | initData, session, client bridge, `X-Init-Data` |
| [erp/references/](./erp/references/) | Full SDK API + `erp` CLI (vendored from package) |

Reference app: [`../miniapp-workshop`](../../miniapp-workshop). Env: [`.env.local.example`](../.env.local.example).
