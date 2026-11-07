# Command palette

Commands register via `@wordpress/commands` `useCommand`. Source lives under `src/js/blocks/commands/`.

## Enqueue split

| Bundle | Entry | Context |
| --- | --- | --- |
| `build/mrshortcuts-gb-commands-block-editor.js` | `commands-block-editor.js` | Block editor (`enqueue_block_editor_assets`) |
| `build/mrshortcuts-gb-commands-admin.js` | `commands-admin.js` | wp-admin (and block editor via `registerPlugin`) |
| `build/mrshortcuts-gb-commands-frontend.js` | `commands-frontend.js` | Frontend when `enableFrontendCommandPalette` is on (WP 6.9+) |

## Commands

| ID | Label | Context | Notes |
| --- | --- | --- | --- |
| `mrshortcuts-gb-toggle-container-outlines` | GenerateBlocks: Toggle Container/Element Outlines | Block editor | Adds outline classes to containers/elements for layout debugging |
| `mrshortcuts-gb-transform-v1-blocks-to-v2` | GenerateBlocks: Convert v1 Blocks to v2 (Experimental) | Block editor | Gated by `enableV1Transformations` |
| `mrshortcuts-gb-transform-headings-to-gb-text` | GenerateBlocks: Convert Headings to Text Blocks | Block editor | Bulk-convert core headings |
| `mrshortcuts-gb-transform-paragraphs-to-gb-text` | GenerateBlocks: Convert Paragraphs to Text Blocks | Block editor | Bulk-convert core paragraphs |
| `mrshortcuts-gb-refresh-css-files` | GenerateBlocks: Generate CSS Files | Admin + frontend | `POST mediaron/block-shortcuts-for-gb/v1/regenerate_css_files` |
| `mrshortcuts-gb-save-svg-to-asset-library` | GenerateBlocks: Save SVG to Asset Library | Block editor | Pro only; paste SVG into the Asset Library |
| `mrshortcuts-gb-generate-unique-ids` | GenerateBlocks: Generate New Unique IDs | Block editor | New `uniqueId` for every GenerateBlocks block in the post. Rewrites saved `css` selectors. Skips synced patterns (`core/block`). |
| `mrshortcuts-gb-import-pattern` | GenerateBlocks: Import Pattern | Block editor | Textarea for block markup. Sideloads remote images via `POST /process_image`, shows each image’s status, regenerates GenerateBlocks unique IDs, then inserts the blocks. |

## Implementation tips

- Block-editor commands that need modals return JSX from their hooks; `commands-block-editor.js` renders those modals from the registered plugin.
- Admin/frontend Refresh CSS uses a footer mount point (`#mrshortcuts-gb-commands-admin` / frontend equivalent) plus `createRoot` when outside the block editor.
- Prefer searching the palette for “GenerateBlocks” when testing.
