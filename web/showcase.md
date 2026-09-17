# TeqFW Showcase

The Showcase is inspectable software demonstrating composition and reuse, not an achievement gallery.

## Platform

- [`@teqfw/di`](https://github.com/teqfw/di) is the foundational plugin for namespace-based dependency resolution, runtime composition, and late binding.
- [`@teqfw/log`](https://github.com/teqfw/log), [`@teqfw/cfg`](https://github.com/teqfw/cfg), [`@teqfw/cli`](https://github.com/teqfw/cli), [`@teqfw/db`](https://github.com/teqfw/db), and [`@teqfw/web`](https://github.com/teqfw/web) add complementary logging, configuration, lifecycle/CLI, persistence, and web-runtime infrastructure.

## Reusable plugins

- [`teq-tmpl`](https://github.com/flancer32/teq-tmpl) demonstrates reusable TeqFW plugin functionality.
- [`teq-cms`](https://github.com/flancer32/teq-cms) is a larger reusable product/plugin composed from platform services and `teq-tmpl`.

## Host application and working product

- [`site_wg`](https://github.com/flancer32/site_wg) is a host application using `teq-cms`.
- [`wiredgeese.com`](https://wiredgeese.com/) is a working website powered by `site_wg`.

## Different application shape

- [`mindstream`](https://github.com/flancer32/mindstream) is a structurally different database-backed TeqFW application, available at [`mindstream.app.wiredgeese.com`](https://mindstream.app.wiredgeese.com/).

These artifacts show a composition path, not platform completeness or universal architectural superiority. TeqFW and the Showcase products are developed primarily by coding agents under one human developer’s direction, architectural control, and final responsibility; this is evidence of agent-readiness, not autonomous development.
