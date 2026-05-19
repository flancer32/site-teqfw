# @flancer32/site-teqfw

Server-side rendered website application for [`teqfw.com`](https://teqfw.com/).

`teqfw.com` is the public entry point into Alex Gusev's TeqFW + ADSM ecosystem for controlled JavaScript product creation and evolution with LLM agents. The site is also a proof product: it presents a method for governed agent-driven development and is itself built and evolved through that approach.

The product starts from a specific visitor problem: LLM agents can generate code, but repeated agent-driven changes can make a real JavaScript product fragile when product meaning lives only in prompts and chat history. The site presents one coherent answer to that control problem through:

- `TeqFW` as the governed JavaScript product environment for agent work.
- `ADSM` as the cognitive-context method for agent-driven software management.
- `GitHub Flows` as the repository-driven workflow proof point.
- public proof artifacts, including this site itself.
- the ADSM book as the current paid explanation layer.

The central positioning statement is: `Code is cheap. Show me the spec.`

## Product Scope

This repository contains the production code for the public website. The site is not intended to be a generic documentation portal, CMS, framework showcase, or consulting funnel. It is a compact engineering presentation surface that:

- qualifies advanced agent users and product owners,
- frames the control problem around repeated agent-driven JavaScript changes,
- routes visitors to public proof, method, ecosystem, and contact pages,
- supports the ADSM book as the current primary commercial action.

## Repository Structure

- `src/` application source code.
- `tmpl/` Nunjucks templates for public pages and shared layout fragments.
- `meta/` authored site metadata and page definitions.
- `web/` public static assets.
- `bin/bootstrap.mjs` application entry point.
- `test/` unit and integration tests.
- `ctx/` cognitive context and product specifications that govern the implementation.

## Local Development

Requirements:

- Node.js `>=20`
- npm

Install dependencies:

```bash
npm install
```

Create local environment configuration:

```bash
cp .env.example .env
```

Start the site:

```bash
npm start
```

By default the built-in web server uses port `3000`.

## Validation

Run the full test suite:

```bash
npm test
```

Run only unit tests:

```bash
npm run test:unit
```

Run only integration tests:

```bash
npm run test:integration
```
