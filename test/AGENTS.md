# Test Catalog

- Path: `test/AGENTS.md`
- Version: `20260524`

## Purpose

This level binds the product test catalog to the TeqFW testing contracts and the project-specific testing layout.

## Level Map

- `integration/` — runtime scenario tests for observable behavior under composition.
- `unit/` — module-level tests for isolated implementation contracts.
- `AGENTS.md` — local test-catalog entry point and navigation rule.

## Reading Order

1. `ctx/docs/code/layout/testing.md`
2. `ctx/docs/code/layout/testing/unit.md`
3. `ctx/docs/code/layout/testing/integration.md`
4. `ctx/spec/ns/teqfw/platform/quality/testing/AGENTS.md`
5. `ctx/spec/ns/teqfw/platform/quality/testing/overview.md`
6. `ctx/spec/ns/teqfw/platform/quality/testing/unit.md`
7. `ctx/spec/ns/teqfw/platform/quality/testing/integration.md`

## Test Catalog Rules

- Unit tests in `test/unit/` must remain isolated and contract-focused.
- Integration tests in `test/integration/` must remain scenario-oriented and composition-focused.
- Demo-page coverage must not depend on specific demo-page prose, titles, or subject matter.
- Demo-page tests must validate both supported states of the demo-page set when applicable:
  - empty
  - populated

## Boundary

This level defines navigation and local test-catalog expectations only.

It does not redefine the TeqFW testing contracts, product meaning, or implementation behavior.
