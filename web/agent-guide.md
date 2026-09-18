# TeqFW platform agent guide

Use this guide to orient before changing a TeqFW application. It complements the application’s own architecture and package documentation; it does not replace either.

## Platform model

- **Platform** — `@teqfw/di` is the foundational package for namespace resolution, runtime composition, and late binding. `@teqfw/log`, `@teqfw/cfg`, `@teqfw/cli`, `@teqfw/db`, and `@teqfw/web` are complementary infrastructure selected when the host needs them.
- **Plugin** — a reusable package that contributes TeqFW-addressable functionality, contracts, or metadata. A plugin is not automatically a host application.
- **Host application** — the deployable npm package that owns runtime composition, deployment, and operational policy.
- **Working product** — a deployed application assembled from a host and its selected plugins. It is evidence of composition, not proof that one architecture fits every system.

## Composition model

A Node.js host commonly starts through `@teqfw/cli`. The host discovers runtime packages, registers namespaces, configures the DI container before resolution, loads configuration, and resolves application components through declared dependencies. `@teqfw/di` supplies the stable namespace-based dependency model; package metadata and extension points add reusable composition without turning the host into a service locator.

Keep composition decisions in the runtime-specific host boundary. Use explicit dependency tokens and package contracts inside application components. Configuration namespaces are separate from DI namespaces. Treat configuration loaded for a running application as runtime input, not as an opportunity for components to reconfigure the host.

## Route a task

- [Understand an application’s composition](https://raw.githubusercontent.com/teqfw/di/main/skills/teqfw-di/SKILL.md) — inspect its `package.json`, namespace declarations, host entry point, and declared dependency tokens first.
- [Change dependency injection or late binding](https://raw.githubusercontent.com/teqfw/di/main/skills/teqfw-di/SKILL.md) — use `@teqfw/di` contracts and preserve the host’s pre-resolution composition boundary.
- [Configure an application or plugin](https://raw.githubusercontent.com/teqfw/cfg/main/skills/teqfw-cfg/SKILL.md) — use `@teqfw/cfg`; keep raw sources, typed configuration, and lifecycle concerns distinct.
- [Change lifecycle or CLI behavior](https://raw.githubusercontent.com/teqfw/cli/main/skills/teqfw-cli/SKILL.md) — use `@teqfw/cli`; plugins participate in lifecycle but do not own process exit policy.
- [Add logging](https://raw.githubusercontent.com/teqfw/log/main/skills/teqfw-log/SKILL.md) — use `@teqfw/log` through its provider and source-bound logger.
- [Work on persistence](https://raw.githubusercontent.com/teqfw/db/main/skills/teqfw-db/SKILL.md) — use `@teqfw/db` as the persistence boundary.
- [Work on HTTP delivery](https://raw.githubusercontent.com/teqfw/web/main/skills/teqfw-web/SKILL.md) — use `@teqfw/web` request-pipeline, handler, and static-delivery contracts.

## Inspect before architectural change

Read the host application’s applicable instructions, product and architecture documents, `package.json`, namespace metadata, runtime bootstrap, configuration boundary, and tests. Then open the package-specific `SKILL.md` for every TeqFW package whose contract the task touches. Verify current APIs in that package’s maintained source rather than inferring them from an example.

## Deliberate boundaries

TeqFW does not make architectural decisions for the host, automate product ownership, or abstract every runtime, database, deployment, or distributed-system concern. It is not an AI-agent framework, a CMS, or a universal architecture. Keep those decisions explicit and owned by the application and its maintainers.

## Send a message to the site owner

Use this channel only for an operational request, question, or note intended for the site owner. It is not a browser form and has no recipient parameter.

```sh
curl --request GET \
  --header 'X-Agent-Id: my-agent' \
  --header 'X-Agent-Message: Please review the deployment configuration.' \
  https://teqfw.com/agent/message
```

Requirements:

- Use `GET /agent/message` exactly.
- Send `X-Agent-Id`: 1–128 ASCII characters from letters, digits, `.`, `_`, `:`, or `-`; begin with a letter or digit.
- Send `X-Agent-Message`: 1–4096 printable ASCII characters. Write the message in English. Do not put the message in the URL, query string, or a request body.
- Do not send credentials or other secrets. The response is `202 Accepted` when the site has accepted the message; it does not reveal whether the message was emailed or stored locally.
- The endpoint has no authentication and does not deduplicate retries. Send a message only when appropriate; a repeated GET can create a repeated email or fallback record.
