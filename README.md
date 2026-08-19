# @flancer32/site-teqfw

Server-side rendered public website for [Tequila Framework](https://teqfw.com/).

`teqfw.com` presents TeqFW as an evolving modular JavaScript platform for web applications. Its positioning is **Enterprise architecture. Vanilla JavaScript.**

TeqFW adapts mature architectural ideas—dependency injection, late binding, runtime composition, namespaces, explicit contracts, lifecycle, configuration, logging, persistence, and web infrastructure—to native JavaScript ES modules. `@teqfw/di` is the foundational plugin; the platform also includes `@teqfw/log`, `@teqfw/cfg`, `@teqfw/cli`, `@teqfw/db`, and `@teqfw/web`.

The primary site structure is:

- Home — platform discovery.
- Ecosystem — platform-to-plugin-to-application composition.
- Philosophy — TeqFW architectural principles and the canonical `teqfw/di` source.
- Showcase — inspectable `teq-tmpl`, `teq-cms`, `site_wg` / wiredgeese.com, and mindstream software.
- Contacts — TeqFW-related and formal communication.

ADSM and its book are related methodology; `/method` remains a secondary page. The retained Demo Pages route is legacy experimental material and is excluded from primary navigation and the sitemap.

## Repository Structure

- `src/` application source code.
- `tmpl/` Nunjucks templates for public pages and shared layouts.
- `meta/` authored site and page metadata.
- `web/` public static assets and sitemap.
- `test/` unit and integration tests.
- `ctx/` cognitive context governing the implementation.

## Local Development

Requirements: Node.js `>=20` and npm.

```bash
npm install
cp .env.example .env
npm start
```

`npm start` runs `teq web:start`; the built-in web server uses port `3000` by default. Configuration is read through `@teqfw/cfg` from `.env` and the process environment.

## Validation

```bash
npm test
```

The project currently has no `typecheck` script; use the TeqFW ESM validator for changes under `src/`.
