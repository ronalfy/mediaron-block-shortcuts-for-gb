---
title: "Block Settings"
slug: block-settings
products: [block-shortcuts-for-gb]
sections: ["Settings"]
status: publish
order: 10
toc: true
---

# Block Settings

Open **GenerateBlocks → Shortcuts** and use the **Block Settings** panel. Select **Save Options** when you are done. Open the editor again so the saved options apply.

## Disable GenerateBlocks Pattern Library

Turn this on to hide the Pattern Library button in the block editor header and the Pattern Library item in the editor options menu.

Leave this off to keep the Pattern Library available. It is off by default. Select **Save Options**, then open the editor again so the change applies.

## Disable Pattern Inserter

Turn this on to hide the Pattern Inserter block and the **GenerateBlocks: Import Pattern** command.

Leave this off to keep both available. It is off by default. Select **Save Options**, then open the editor again so the change applies.

See [Pattern Inserter](../editor/pattern-inserter.md) and [Command palette](../editor/command-palette.md).

## Block Identification Helpers

Open **GenerateBlocks → Shortcuts** and use the **Block Identification Helpers** panel. Select **Save Options** when you are done. Open the editor again so the saved options apply.

Saved block content is unchanged. These options change how GenerateBlocks blocks are identified in the editor, and whether 1.x and 2.x blocks are both available.

### Identify GenerateBlocks Blocks

Turn this on to add a suffix to GenerateBlocks block titles, including GenerateBlocks Pro. Core blocks and blocks from other plugins keep their own titles. This works while 1.x blocks are hidden. It is off by default.

The suffix shows in the block inserter, slash commands, List View, and block navigation. A custom name set on a block in List View is left as you wrote it.

#### GenerateBlocks Suffix

Text added to the end of each GenerateBlocks block title. The default is `(GB)`, which displays as **Container (GB)**. A space is inserted automatically. Leave the field blank to add no suffix.

### Enable v1 to v2 conversion

Turn this on to convert GenerateBlocks 1.x blocks to 2.x blocks.

A notice under this option says the conversion is experimental and is only needed when both version 1 and version 2 blocks are present.

When it is on, you can:

- Run **GenerateBlocks: Convert v1 Blocks to v2 (Experimental)** from the command palette. That converts every 1.x block in the current post.
- Use **Convert v1 Blocks to v2** in the block options menu when a single block contains 1.x blocks. That converts the selected block and the blocks inside it.

> [!WARNING]
> The command palette conversion asks you to confirm before it runs. Back up the content first. That conversion cannot be undone.

Leave this off if you are not migrating 1.x blocks. It is off by default.

### Enable v1 and v2 Blocks (Both Visible)

Turn this on to keep GenerateBlocks 1.x and 2.x blocks in the inserter at the same time. Use it while you move a site from 1.x to 2.x. It is off by default.

When GenerateBlocks is active, a notice under this option reports that version 1 blocks are already enabled, or warns that turning this option on shows both versions because GenerateBlocks turned version 1 blocks off.

Version suffixes for this option are under **Version labels** below. They are added only while this option is on.

Category titles are separate. **v1 Category Label** and **v2 Category Label** rename the inserter categories, and that renaming stays active while this option is off.

### Version labels

The version suffix is added only while **Enable v1 and v2 Blocks (Both Visible)** is on. It is added after the GenerateBlocks suffix. With both systems on, a 1.x block reads **Container (GB) (v1)** and a 2.x block reads **Container (GB) (v2)**.

The category label fields edit those inserter titles. A saved title remains after this option is turned off.

#### v1 Category Label

The inserter category title for 1.x blocks. The default is **GenerateBlocks v1**. These categories are listed toward the end of the category list. The plugin applies this title while **Enable v1 and v2 Blocks (Both Visible)** is off.

#### v2 Category Label

The inserter category title for 2.x blocks. The default is **GenerateBlocks v2**. These categories are listed toward the beginning of the category list. The plugin applies this title while **Enable v1 and v2 Blocks (Both Visible)** is off.

#### v1 Block Suffix

Text added to the end of each 1.x block name. The default is `(v1)`. A space is inserted automatically. Leave the field blank to add no suffix.

#### v2 Block Suffix

Text added to the end of each 2.x block name. The default is `(v2)`. A space is inserted automatically. Leave the field blank to add no suffix.

### Block Colors

Background, icon, and text colors apply to GenerateBlocks and GenerateBlocks Pro blocks in the block inserter. Slash command icon color applies only to those blocks in the slash command inserter. Core blocks and blocks from other plugins are unchanged.

All four colors start cleared, so the editor is unchanged until you choose one. The palette leads with Blue (`#1e72bd`), Light Blue (`#e8f0fe`), Brand (`#0e1120`), Ink (`#0c0e0f`), and Paper (`#fafbff`), then the theme colors. Light Blue stays readable with dark text such as Ink or Brand. Each color appears once. Clear one color to remove only that color. Select **Reset Options** to clear all four.

Select **Save Options**, then open the editor again so the change applies.

## Related

Markdown headings are also configured in the Block Settings panel. See [Markdown to Text](markdown-to-text.md).
