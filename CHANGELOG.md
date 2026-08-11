# Changelog

All notable changes to this project are documented here.

## [1.0.0] - 2026-08-04

### Breaking

- Replaced the application-owned `bin/bootstrap.mjs` process entrypoint with `@teqfw/cli` and `teq web:start`.
- Converted the application runtime composition into a TeqFW CLI lifecycle plugin.
- Migrated web configuration loading to `@teqfw/cfg` and lifecycle logging to `@teqfw/log`.
- Updated deployment to launch the published `@teqfw/cli` executable through PM2.

### Added

- Added CLI discovery integration coverage and a migration checklist in the project context.
- Mounted version-aligned TeqFW consumer skills under `.agents/skills/`.

### Changed

- Updated package metadata to canonical `teqfw.fw.di` and `teqfw.fw.cli` protocols.
- Updated local development, CI, deployment, and configuration documentation.
