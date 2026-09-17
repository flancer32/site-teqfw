# TeqFW ecosystem

The ecosystem is a progression from platform mechanisms to reusable functionality, host applications, and working products:

`TeqFW platform → reusable plugins → host applications → working products`

## Platform packages

`@teqfw/di` is the foundational plugin. It provides namespace-based dependency resolution, runtime composition, and late binding. The complementary packages are:

- [`@teqfw/log`](https://github.com/teqfw/log) — logging infrastructure. [Agent skill](https://github.com/teqfw/log/tree/main/skills/teqfw-log).
- [`@teqfw/cfg`](https://github.com/teqfw/cfg) — application and plugin configuration. [Agent skill](https://github.com/teqfw/cfg/tree/main/skills/teqfw-cfg).
- [`@teqfw/cli`](https://github.com/teqfw/cli) — Node.js lifecycle and CLI composition. [Agent skill](https://github.com/teqfw/cli/tree/main/skills/teqfw-cli).
- [`@teqfw/db`](https://github.com/teqfw/db) — database infrastructure. [Agent skill](https://github.com/teqfw/db/tree/main/skills/teqfw-db).
- [`@teqfw/web`](https://github.com/teqfw/web) — web and server runtime infrastructure. [Agent skill](https://github.com/teqfw/web/tree/main/skills/teqfw-web).

The foundational package also publishes its [agent skill](https://github.com/teqfw/di/tree/main/skills/teqfw-di). Each skill is version-matched package guidance describing public contracts, integration patterns, and architectural assumptions. A consuming project may mount it in `.agents/skills/`. Skills complement README files and source code; they do not replace them.

## Reusable plugins and applications

- [`teq-tmpl`](https://github.com/flancer32/teq-tmpl) demonstrates reusable TeqFW functionality.
- [`teq-cms`](https://github.com/flancer32/teq-cms) is a larger reusable product/plugin composed from TeqFW infrastructure and `teq-tmpl`.
- [`site_wg`](https://github.com/flancer32/site_wg) is a host application using `teq-cms` and powering [`wiredgeese.com`](https://wiredgeese.com/).
- [`mindstream`](https://github.com/flancer32/mindstream) demonstrates a structurally different database-backed TeqFW application, with a public route at [`mindstream.app.wiredgeese.com`](https://mindstream.app.wiredgeese.com/).

ADSM is related methodology, not a required TeqFW layer.
