# Developer documentation

## Directory map

```
mediaron-block-shortcuts-for-gb/
├── mediaron-block-shortcuts-for-gb.php       # Bootstrap
├── php/                # Admin, Admin_Bar, Blocks, Functions, Options
├── src/
│   ├── index.js        # Editor plugins / transforms
│   ├── js/blocks/      # Commands, pattern-importer, labels, utils
│   ├── js/react/       # Settings React app
│   └── scss/           # Admin styles
├── build/              # Editor + commands webpack output
├── dist/               # Admin JS/CSS webpack output
├── lib/                # Composer autoloader (vendor-dir)
├── webpack.config.js   # Dual config → build/ and dist/
└── Gruntfile.js        # Release ZIP
```

## Build

```bash
npm install
npm run start    # development watch
npm run build    # production
grunt            # optional zip
```

[webpack.config.js](../webpack.config.js) exports two configs:

1. **Default `@wordpress/scripts` config** → `build/`
   - `index` ← `src/index.js`
   - `mrshortcuts-gb-block-labels`
   - `mrshortcuts-gb-commands-block-editor`
   - `mrshortcuts-gb-commands-admin`
   - `mrshortcuts-gb-commands-frontend`
2. **Custom admin config** → `dist/`
   - `mrshortcuts-gb-admin` ← `src/js/react/views/main/index.js`
   - `mrshortcuts-gb-admin-css` ← `src/scss/admin.scss`

Enqueue mapping:

- `php/Admin.php` → `dist/mrshortcuts-gb-admin.js` + `dist/mrshortcuts-gb-admin-css.css`
- `php/Blocks.php` → `build/index.js`, labels, and command bundles

PHP classes autoload via Composer PSR-4: `MRShortcutsGB\` → `php/` (`composer.json`, generated files under `lib/`).

## Options schema

Stored under option key **`mrshortcutsgb_options`** (site option on multisite). Defaults from `Options::get_defaults()`:

| Key | Type | Default |
| --- | --- | --- |
| `enableAdobeFonts` | bool | `true` |
| `enableMarkdownToHeadlineBlock` | bool | `false` |
| `enablePastePatternProcessing` | bool | `false` |
| `enabledPostTypes` | object | `{ post: true, page: true }` |
| `autoRegenerateStylesPostTypes` | object | `{}` |
| `allowedGoogleFonts` | array | `[]` (unused in UI) |
| `enableV1Transformations` | bool | `false` |
| `enableV1Blocks` | bool | `false` |
| `v1CategoryLabel` | string | `GenerateBlocks v1` |
| `v2CategoryLabel` | string | `GenerateBlocks v2` |
| `v1BlockSuffix` | string | `(v1)` |
| `v2BlockSuffix` | string | `(v2)` |
| `adminMenuBar.enabled` | bool | `true` |
| `adminMenuBar.replaceWithFullMenu` | bool | `false` |
| `enableFrontendCommandPalette` | bool | `false` |

## Extension points

### Exposed by this plugin

| Hook | Type | When |
| --- | --- | --- |
| `mrshortcutsgb_loaded` | action | After Admin / Admin_Bar / Blocks boot |

There is no broader intentional public PHP/JS API. Treat other identifiers as internal.

### Consumed (GenerateBlocks / WordPress)

Examples: `generateblocks_typography_font_family_list`, `generateblocks_do_content`, `generateblocks_dashboard_screens`, `block_categories_all`, `block_type_metadata`, `blocks.registerBlockType`, admin-bar APIs.

## AJAX

All require `manage_options` and matching nonces.

| Action | Purpose |
| --- | --- |
| `mrshortcutsgb_get_options` | Load options for the settings React app |
| `mrshortcutsgb_save_options` | Persist settings form |
| `mrshortcutsgb_reset_options` | Reset to defaults |

## REST

Namespace: `mediaron/block-shortcuts-for-gb/v1`

| Route | Method | Purpose |
| --- | --- | --- |
| `/process_image` | POST | Sideload a remote image for the Pattern Inserter, paste pattern processing, and the Import Pattern command |
| `/regenerate_css_files` | POST | Clear `generateblocks_dynamic_css_posts`; Pro calls `GenerateBlocks_Pro_Enqueue_Styles::build_css()` |
| `/asset_icon_groups` | GET | Unique group names from `generateblocks_svg_icons` (Pro) |
| `/save_asset_icon` | POST | Append one icon to `generateblocks_svg_icons` (Pro); reuse an existing group item when the SVG markup already matches. Sanitizes via Safe SVG when present, else Pro’s `unfiltered_html` / `generateblocks_pro_kses_svg()` path. |

`/process_image` uses `Blocks::rest_image_sideload_permissions` (`upload_files` and `publish_posts`). The Pattern Inserter, paste pattern processing, and the Import Pattern command all call it. Import Pattern passes `restUrl` and `restNonce` into `processPatternMarkup`; paste falls back to `mrshortcutsgbPatternInserter`. `/regenerate_css_files`, `/asset_icon_groups`, and `/save_asset_icon` require `manage_options`. Asset Library routes return 400 when GenerateBlocks Pro is inactive.

## Localized script globals

| Global | Script | Contents |
| --- | --- | --- |
| `mrshortcutsgbAdmin` | Admin settings | Nonces, `ajaxurl`, post type list, `isProActive` |
| `mrshortcutsgbPatternInserter` | Editor / pattern tools | Options flags (including `enablePastePatternProcessing`), REST URL/nonce, v1/v2 suffix strings, `isProActive`, `canManageAssetLibrary`, `canSideloadImages` |
| `mrshortcutsgbCommands` | Block-editor commands | `isProActive`, `restUrl`, `restNonce`, `canSideloadImages` |

## Coding standards

- PHP: [phpcs.xml.dist](../phpcs.xml.dist) (WordPress). Prefer phpcbf after edits.
- JS: [.eslintrc.json](../.eslintrc.json) (`@wordpress/eslint-plugin`).
- Text domain: `mediaron-block-shortcuts-for-gb`.

## Related docs

- [FEATURES.md](FEATURES.md)
- [COMMANDS.md](COMMANDS.md)
- [../AGENTS.md](../AGENTS.md)
- [../CONTRIBUTING.md](../CONTRIBUTING.md)
