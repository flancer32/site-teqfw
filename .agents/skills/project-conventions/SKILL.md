---
name: project-conventions
description: Project-specific conventions. Use for every task in this repository.
---

# Project Conventions

`AGENTS.md` overrides this file.

## Repositories

- The root repository `flancer32/site-teqfw` and the `ctx/` repository `flancer32/site-teqfw-ctx` are separate repositories; do not mix status, commits, or pushes.
- `ctx/` is the authoritative cognitive context.

## Workflow

- Work in the repository's `main` branch. This project rule overrides any GitHub-skill instruction to use a separate branch.
- At the start of work, check upstream in the root and `ctx/`; keep each local `main` synchronized by fast-forwarding when safe.
- Before changes, inspect every affected working tree.
- Do not commit or push unless the user requests it.

## Communication

- User: Russian; code, comments, documentation, commits, and identifiers: English.
- Report changes, verification, and remaining risks.

## Project boundaries

- `src/` contains the TeqFW ESM application runtime, `test/` contains unit and integration tests, `tmpl/` contains Nunjucks templates, `meta/` contains authored runtime metadata, and `web/` contains public assets.
- `ctx/` governs product and architecture decisions; it is not product implementation and must not be changed unless explicitly requested.
- `node_modules/` is external dependency state. Dependency-owned consumer skills are mounted into `.agents/skills/` from installed packages.

## Validation

- `npm test` is required for changes affecting runtime composition or package dependencies.
- `teqfw-esm-validator src` is required for changes under `src/`; it does not apply to package files, tests, templates, public assets, or generated files.
- Use `teqfw-platform` for TeqFW architecture, dependency integration, and package-contract decisions.

## GitHub

- In all multiline text sent to GitHub, including issues and comments, use actual line breaks; never send literal `\n`, which GitHub displays as text.

## Shared memory

- `flancer32/ai-memo` is the shared cross-project issue tracker and memory.
- May create issues: source `flancer32/site-teqfw`; every issue must name the project or projects expected to resolve it.
- When referring to a commit in another repository, use its full GitHub URL: `https://github.com/vendor/name/commit/<sha>`.
- Notes: `project/flancer32/site-teqfw/`.

## Editing fallback

- Use `apply_patch`; on `bwrap` or network-namespace failure, use a scoped `git apply`; then run `git diff --check` in each affected repository.
