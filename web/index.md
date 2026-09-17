# TeqFW

Tequila Framework (TeqFW) is an evolving modular JavaScript platform for web applications. The preferred positioning is **Enterprise architecture. Vanilla JavaScript.**

TeqFW adapts mature architectural ideas to native JavaScript: dependency injection, late binding, modular composition, explicit contracts, lifecycle management, configuration, persistence, and web infrastructure. It composes applications at runtime through explicit namespaces, declared dependencies, reusable plugins, and minimal source-to-runtime transformation.

## What TeqFW is—and is not

TeqFW is a platform for web applications, not only a DI container. `@teqfw/di` is its foundational plugin, while logging, configuration, lifecycle, persistence, and web runtime are complementary platform concerns. TeqFW is not an AI-agent framework, a generic CMS, or a documentation portal. Agent-readiness is a secondary benefit of its explicit architecture.

## Platform foundation

- [`@teqfw/di`](https://github.com/teqfw/di) — foundational namespace resolution, runtime composition, and late binding.
- [`@teqfw/log`](https://github.com/teqfw/log) — logging infrastructure.
- [`@teqfw/cfg`](https://github.com/teqfw/cfg) — application and plugin configuration.
- [`@teqfw/cli`](https://github.com/teqfw/cli) — Node.js lifecycle and CLI composition.
- [`@teqfw/db`](https://github.com/teqfw/db) — database infrastructure.
- [`@teqfw/web`](https://github.com/teqfw/web) — web and server runtime infrastructure.

Every plugin publishes version-matched agent-use guidance at `skills/<name>/SKILL.md`; the [ecosystem document](https://teqfw.com/ecosystem.md) links each catalog directly.

## Composition model

`TeqFW platform → reusable plugins → host applications → working products`

The [Showcase](https://teqfw.com/showcase.md) provides factual evidence through `teq-tmpl`, `teq-cms`, `site_wg` / `wiredgeese.com`, and `mindstream`. ADSM is secondary related methodology, not the TeqFW product.

TeqFW and the Showcase products are developed primarily by coding agents under one human developer’s direction, architectural control, and final responsibility. This supports the agent-readiness claim; it does not imply autonomous architecture or team replacement.
