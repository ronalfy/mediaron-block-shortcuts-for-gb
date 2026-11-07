# MediaRon Block Shortcuts for GenerateBlocks

MediaRon Block Shortcuts for GenerateBlocks is a companion plugin for [GenerateBlocks](https://wordpress.org/plugins/generateblocks/). It adds editor shortcuts, migration helpers, settings integrations, and admin-bar tooling on top of GenerateBlocks (and GenerateBlocks Pro where noted).

## Requirements

- WordPress 6.8 or later
- PHP 7.2 or later
- [GenerateBlocks](https://wordpress.org/plugins/generateblocks/) (required)
- GenerateBlocks Pro (optional; required for admin-bar menu replacement features)
- WordPress 6.9+ for the frontend command palette option

## Features

Settings live under **GenerateBlocks → Shortcuts**.

- **Adobe Fonts** — Show Adobe Fonts (and Blocksy Adobe fonts when present) in the GenerateBlocks typography picker.
- **Block settings** — Enable v1→v2 transform commands, show both v1 and v2 blocks with custom category labels/suffixes, and optionally enable the frontend command palette for administrators.
- **Markdown to Text** — Type `#` / `##` prefixes to insert GenerateBlocks Text blocks instead of core headings.
- **Post type styles** — Choose which post types GenerateBlocks styles should run on.
- **Auto-regenerate styles on save** — Clear GenerateBlocks CSS caches when selected post types are saved.
- **Admin menu bar** — Hide or replace the GenerateBlocks Pro overlay admin-bar menu with a fuller GenerateBlocks menu (Pro).

Always-on editor tools include wrap in container, generate unique IDs, clear v2 styles, unwrap container/grid, transform shape to link, contextual v1→v2 conversion, Pattern Inserter, and command-palette shortcuts.

Full detail: [docs/FEATURES.md](docs/FEATURES.md). Commands: [docs/COMMANDS.md](docs/COMMANDS.md).

## Installation

1. Copy this plugin into `wp-content/plugins/mediaron-block-shortcuts-for-gb` (or install a release ZIP).
2. Activate **GenerateBlocks**, then activate **MediaRon Block Shortcuts for GenerateBlocks**.
3. Open **GenerateBlocks → Shortcuts** to configure options.

## Development

```bash
npm install
npm run start    # watch builds
npm run build    # production build
grunt            # package mediaron-block-shortcuts-for-gb.zip (optional)
```

See [docs/DEVELOPERS.md](docs/DEVELOPERS.md) for architecture (`build/` vs `dist/`), options schema, hooks, and APIs.

## Documentation

| Doc | Audience |
| --- | --- |
| [documentation/](documentation/README.md) | User knowledge base (GitHub sync source) |
| [docs/FEATURES.md](docs/FEATURES.md) | Feature reference and Free vs Pro |
| [docs/DEVELOPERS.md](docs/DEVELOPERS.md) | Architecture and contributor reference |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Command palette IDs |
| [AGENTS.md](AGENTS.md) | AI / fork maintainer handoff |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Pull request expectations |

## License

GPL. See [LICENSE](LICENSE). The plugin header declares GPL v2 or later; the packaged `LICENSE` file is GPLv3.
