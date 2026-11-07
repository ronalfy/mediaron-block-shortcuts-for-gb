# AGENTS.md — MediaRon Block Shortcuts for GenerateBlocks

Handoff notes for AI agents and fork maintainers. Prefer this file plus `docs/DEVELOPERS.md` over outdated plan docs.

## Mission

Companion plugin for GenerateBlocks. Enhance the editor, settings, styles pipeline, and (with Pro) admin bar — without commercial licensing, EDD updaters, or external marketing/docs links.

## Stack

| Layer | Details |
| --- | --- |
| PHP | Namespace `MRShortcutsGB`, PSR-4 via Composer autoload (`lib/` → `php/`) |
| Bootstrap | `mediaron-block-shortcuts-for-gb.php` loads Admin, Admin_Bar, Blocks; fires `mrshortcutsgb_loaded` |
| Admin UI | React (`src/js/react/views/main/`) → webpack **`dist/`** (`mrshortcuts-gb-admin.js` + CSS) |
| Editor | `src/index.js`, pattern importer, block labels → webpack **`build/`** |
| Commands | Three entrypoints under `src/js/blocks/commands/` → `build/mrshortcuts-gb-commands-*.js` |

Do not confuse **`build/`** (editor/commands) with **`dist/`** (settings admin). `php/Admin.php` enqueues `dist/`; `php/Blocks.php` enqueues `build/`.

## Key files

| Path | Role |
| --- | --- |
| `mediaron-block-shortcuts-for-gb.php` | Plugin header, bootstrap, `mrshortcutsgb_loaded` |
| `php/Admin.php` | Settings submenu, AJAX get/save/reset, admin assets |
| `php/Options.php` | Option key + defaults |
| `php/Blocks.php` | Fonts, styles post types, REST, script enqueue, CSS regen |
| `php/Admin_Bar.php` | Pro admin-bar hide / full menu (priority 101) |
| `php/Functions.php` | Helpers (URLs, sanitization, capability checks) |
| `src/js/react/views/main/main.js` | Settings panels |
| `src/index.js` | Block overflow menu plugins + transforms + markdown |
| `src/js/blocks/commands/` | Command palette registrations |
| `webpack.config.js` | Dual webpack configs |

## Stable identifiers (do not rename casually)

- Options option: `mrshortcutsgb_options`
- Admin page slug: `mrshortcuts-gb` (screen: `generateblocks_page_mrshortcuts-gb`)
- AJAX actions: `mrshortcutsgb_{get,save,reset}_options`
- REST namespace: `mediaron/block-shortcuts-for-gb/v1`
- Block name: `mediaron/mrshortcuts-pattern-inserter`
- Localized globals: `mrshortcutsgbAdmin`, `mrshortcutsgbPatternInserter`
- Text domain: `mediaron-block-shortcuts-for-gb`

Renaming any of these needs a migration plan (saved options, content with the pattern block, enqueue handles).

## Conventions

- WordPress PHP and JS coding standards.
- Run phpcbf (WordPress standard) after PHP edits.
- Rebuild with `npm run build` after JS/SCSS changes.
- Periods at the end of code comments.
- Prefer matching existing patterns in Admin settings UI (PanelBody + PanelRow, GenerateBlocks dashboard shell).

## Do not

- Reintroduce EDD / commercial license UI, updater phone-home, or product IDs.
- Add Docs / Plugin Home / DLX marketing links on the Plugins screen or README.
- Commit `.npmrc` or other registry auth tokens (`.npmrc` is gitignored).
- Assume `menus.md` or `2.5.md` exist — they are gitignored and not part of the repo.
- Treat root historical plan files as source of truth; use `docs/` instead.

## Verify before finishing a change

1. `npm run build` succeeds.
2. PHP syntax / phpcs on touched PHP files.
3. Settings screen: load, save, reset.
4. If commands changed: open command palette (Ctrl/Cmd+K) in the block editor and confirm IDs still register.
5. If admin-bar changed: test with GenerateBlocks Pro active (and inactive for soft-fail paths).

## Known debt (document; do not drive-by “fix” in unrelated PRs)

- `.gitignore` ignores `dist/` and `package-lock.json` while runtime may need built `dist/` assets.
- Dead / incomplete: `allowedGoogleFonts` option, `enableDefaultHeadlineBlock` referenced in UI without a default in `Options.php`.
- Misnamed leftovers: `wppic_block_file_extensions` filter in `Functions.php`; occasional wrong text domains (`alerts-dlx`).
- License wording: header GPL v2+, `package.json` GPL-3.0, `LICENSE` GPLv3.

## Useful docs

`docs/` is the developer reference. `documentation/` is the end-user knowledge base, written for WebberZone Knowledge Base Pro GitHub sync (frontmatter includes `products: [block-shortcuts-for-gb]` and a `sections` list). The settings screen is **GenerateBlocks → Shortcuts**.

- [documentation/README.md](documentation/README.md)
- [docs/FEATURES.md](docs/FEATURES.md)
- [docs/DEVELOPERS.md](docs/DEVELOPERS.md)
- [docs/COMMANDS.md](docs/COMMANDS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
