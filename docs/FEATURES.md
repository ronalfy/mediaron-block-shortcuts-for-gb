# Features

MediaRon Block Shortcuts for GenerateBlocks settings: **GenerateBlocks → Shortcuts**.

## Free vs Pro

| Capability | GenerateBlocks (free) | GenerateBlocks Pro |
| --- | --- | --- |
| Settings screen, Adobe fonts, markdown, styles post types, v1/v2 tools, commands, Pattern Inserter | Yes | Yes |
| Hide GenerateBlocks admin-bar items | Soft (no-op if Pro menu absent) | Yes |
| Replace Overlay Panels admin-bar menu with full GenerateBlocks menu | — | Yes |

## Settings

### Adobe Fonts

- **Option:** `enableAdobeFonts` (default `true`)
- Adds Adobe Fonts (and Blocksy Adobe fonts when available) to `generateblocks_typography_font_family_list`.

### Block settings

| Option | Default | Behavior |
| --- | --- | --- |
| `enableV1Transformations` | `false` | Enables command-palette and contextual “Convert v1 Blocks to v2” tools. The toggle is on the Block Identification Helpers panel |
| `enableV1Blocks` | `false` | Keeps both v1 and v2 blocks visible and gates the version suffixes (`v1BlockSuffix` / `v2BlockSuffix`). The toggle is on the Block Identification Helpers panel |
| `identifyGenerateBlocks` | `false` | Appends a suffix to GenerateBlocks and GenerateBlocks Pro block titles. Works while v1 blocks are hidden |
| `blockListColors` | background, icon, and text all `''` | Inserter tile colors for GenerateBlocks and GenerateBlocks Pro. Slash commands use the icon color. A blank value omits that rule. The palette leads with `#1e72bd`, `#0e1120`, `#0c0e0f`, and `#fafbff`, each hex once, then theme colors including 8-digit hex. The fields are at the bottom of the Block Identification Helpers panel |
| `generateBlocksSuffix` | `(GB)` | Suffix used when identification is on. A space is inserted before it. Blank adds nothing |
| `v1CategoryLabel` / `v2CategoryLabel` | GenerateBlocks v1 / v2 | Inserter category titles. `Blocks::add_block_categories()` applies them. Its guard is the constant `true`, so the saved titles rename categories while `enableV1Blocks` is false. The fields are on the Block Identification Helpers panel and show while that toggle is on |
| `v1BlockSuffix` / `v2BlockSuffix` | `(v1)` / `(v2)` | Appended after the block title while `enableV1Blocks` is on, and after the GenerateBlocks suffix when identification is also on |
| `disablePatternLibrary` | `false` | When true, `generateblocks_enable_pattern_library` returns false so the editor Pattern Library button is not loaded |
| `disablePatternInserter` | `false` | When true, unregisters the Pattern Inserter block and hides the Import Pattern command |

### Markdown to Text block

- **Option:** `enableMarkdownToHeadlineBlock` (default `false`)
- When enabled, markdown heading prefixes create GenerateBlocks Text blocks instead of core Heading blocks.

### Post type styles

- **Option:** `enabledPostTypes` (default: `post` and `page` true)
- Controls which post types are included via `generateblocks_do_content` so GenerateBlocks styles apply.

### Admin menu bar (Pro-oriented)

- **Options:** `adminMenuBar.enabled` (default `true`), `adminMenuBar.replaceWithFullMenu` (default `false`)
- When disabled: removes GenerateBlocks admin-bar nodes for Administrators and Editors.
- When replace is enabled: swaps the Overlay Panels root for a fuller menu (Settings, Local Patterns, Global Styles, Overlay Panels, Forms, Conditions, Editor Access, Asset Library, Shortcuts — items appear when the corresponding Pro features exist).

## Always-on editor tools

Block overflow menu items (`PluginBlockSettingsMenuItem` in `src/index.js`):

| Label | When it appears |
| --- | --- |
| Wrap in Container | One or more blocks selected |
| Generate New Unique IDs | GenerateBlocks v1 or v2 block selected |
| Clear Block Styles | GenerateBlocks v2 block selected |
| Unwrap Container / Unwrap Grid | Container or Element with inner blocks |
| Transform Shape to Link | Shape block selected |
| Save SVG to Asset Library | Pro active; Shape, Text, Headline, or Button with SVG markup; `manage_options` |
| Convert v1 Blocks to v2 | Single selection containing v1 blocks; requires `enableV1Transformations` |

Also registered:

- Transform **core/group → generateblocks/element**
- Transform **core/columns → generateblocks/element** (grid). Column count sets `gridTemplateColumns`. Uneven column widths become a simplified `fr` track list. Each column becomes an Element that keeps its inner blocks.
- Transform **generateblocks/shape → generateblocks/text** (link-style icon text)
- Optional markdown prefix transforms when markdown setting is on

## Pattern Inserter

- Block: `mediaron/mrshortcuts-pattern-inserter`
- Paste pattern markup, sideload remote images via REST `POST mediaron/block-shortcuts-for-gb/v1/process_image`, regenerate unique IDs.
- **Option:** `disablePatternInserter` (default `false`). When true, the block is unregistered and the Import Pattern command is hidden.

## Asset Library capture (Pro)

Save an icon into `generateblocks_svg_icons` without leaving the editor:

- Command palette: paste SVG markup, name, and group.
- Overflow menu: capture SVG already on a Shape (`html`) or Text/Headline/Button (`icon`).

After save, `generateBlocksPro.svgIcons` is patched so Pro’s icon picker lists the new icon the next time that panel renders.

SVG markup is sanitized the same way Pro’s Asset Library REST save does: Safe SVG (when that plugin is active), otherwise skip kses for `unfiltered_html`, otherwise `generateblocks_pro_kses_svg()` plus extra presentation tags (gradients, defs, basic shapes).

GenerateBlocks highlights a library tile when its SVG string matches the block, not by unique id. Saving the same markup twice into one group would select both tiles, so the save route skips (and prunes) duplicate SVG strings in that group.

## Command palette

- **Generate New Unique IDs** regenerates `uniqueId` on every GenerateBlocks block in the current post, including blocks nested inside core groups, and rewrites each block’s saved `css` selectors. Synced patterns are left unchanged. Query loop pagination keys change with the new IDs. The editor undo stack can revert the edit.
- **Import Pattern** opens a dialog with a textarea. Hidden when `disablePatternInserter` is true. `processPatternMarkup` sideloads remote images through `POST mediaron/block-shortcuts-for-gb/v1/process_image`, reports each image’s status in the dialog, regenerates GenerateBlocks unique IDs (including `css`), and inserts the blocks.

See [COMMANDS.md](COMMANDS.md) for IDs and contexts.
