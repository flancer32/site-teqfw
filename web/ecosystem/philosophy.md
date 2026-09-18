# TeqFW philosophy

TeqFW is a contextual architecture for modular-monolith web applications with a single database and a unified JavaScript codebase across browser and server environments. The browser is the most universal runtime environment, and JavaScript is its native language. TeqFW is not a universal architecture: distributed high-performance systems, embedded software, and work not centered on LLM assistance may call for other approaches.

Conventional architectures can hide relationships behind static imports, reflection, build pipelines, and undocumented conventions. TeqFW responds with explicit contracts, predictable namespaces, runtime linking, late binding, and machine-oriented documentation so that developers and LLM coding agents can inspect and evolve structure.

## Principles

1. **Unified JavaScript language across the stack.** JavaScript runs across browser and Node.js environments, reducing the translation between parts of an application.
2. **Late binding.** Container- and namespace-based addressing keeps dependencies explicit, replaceable, and testable without rigid compile-time coupling.
3. **Evolutionary resilience.** Clear interaction contracts and flexible processing help software absorb changing requirements with fewer changes to existing components.
4. **Functional separation of data and logic.** Data objects hold state while stateless handlers process structured data, making processing easier to test and extend.
5. **Namespaces for structure and isolation.** Modules, packages, database tables, APIs, and configuration occupy predictable namespaces.
6. **Pure JavaScript with JSDoc.** JSDoc supports IDEs and analysis while source and runtime remain one program, without a TypeScript compilation layer.
7. **Code and documentation optimized for LLM agents.** Predictable files, declared dependencies, module conventions, and consistent documentation help agents assist without hiding architecture from people.
8. **Explicit machine interfaces.** Every TeqFW plugin distributes a version-matched agent skill at `skills/<name>/SKILL.md`; consuming projects may mount it in `.agents/skills/`.

The current skills are [`@teqfw/di`](https://raw.githubusercontent.com/teqfw/di/main/skills/teqfw-di/SKILL.md), [`@teqfw/log`](https://raw.githubusercontent.com/teqfw/log/main/skills/teqfw-log/SKILL.md), [`@teqfw/cfg`](https://raw.githubusercontent.com/teqfw/cfg/main/skills/teqfw-cfg/SKILL.md), [`@teqfw/cli`](https://raw.githubusercontent.com/teqfw/cli/main/skills/teqfw-cli/SKILL.md), [`@teqfw/db`](https://raw.githubusercontent.com/teqfw/db/main/skills/teqfw-db/SKILL.md), and [`@teqfw/web`](https://raw.githubusercontent.com/teqfw/web/main/skills/teqfw-web/SKILL.md). These machine interfaces complement human-facing README files and source code.

TeqFW explores an architecture where humans and LLM agents collaborate on modular web applications. It does not claim universal applicability, autonomous agent ownership, or replacement of traditional architectures.
