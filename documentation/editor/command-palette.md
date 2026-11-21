---
title: "Command Palette"
slug: command-palette
products: [block-shortcuts-for-gb]
sections: ["Editor"]
status: publish
order: 20
toc: true
---

# Command Palette

Open the WordPress command palette with Ctrl+K (Windows and Linux) or Cmd+K (Mac). Search for **GenerateBlocks** to list the shortcuts from this plugin.

Commands run in the block editor.

## Toggle Container/Element Outlines

**GenerateBlocks: Toggle Container/Element Outlines**

Draws an outline around GenerateBlocks Containers and Elements in the editor so you can see layout boundaries. Run the command again to turn the outlines off. Outlines are an editing aid. They are not saved on the blocks and do not appear on the front end.

## Convert v1 Blocks to v2

**GenerateBlocks: Convert v1 Blocks to v2 (Experimental)**

Appears only when **Enable v1 to v2 conversion** is on.

Converts every GenerateBlocks 1.x block in the current post to 2.x. A confirmation box asks you to check **I understand and want to proceed** before it runs.

> [!WARNING]
> Back up the content first. This conversion cannot be undone.

To convert one selection instead of the whole post, use **Convert v1 Blocks to v2** in the [block options menu](block-menu-tools.md).

## Convert Headings to Text Blocks

**GenerateBlocks: Convert Headings to Text Blocks**

Converts every core Heading in the current post into a GenerateBlocks Text block. The palette shows how many headings it found and asks you to confirm.

## Convert Paragraphs to Text Blocks

**GenerateBlocks: Convert Paragraphs to Text Blocks**

Converts every core Paragraph in the current post into a GenerateBlocks Text block. Confirm before it runs.

## Save SVG to Asset Library

**GenerateBlocks: Save SVG to Asset Library**

Requires GenerateBlocks Pro and an Administrator account. Paste SVG markup, name the icon, and choose a group. See [Save an SVG to the Asset Library](asset-library.md).

## Generate New Unique IDs

**GenerateBlocks: Generate New Unique IDs**

Gives every GenerateBlocks block in the current post a new unique ID, including blocks nested inside core Groups. Saved CSS selectors that used the old IDs are rewritten to match.

Synced patterns are left unchanged. Query loop pagination keys use these IDs, so those keys change with the new IDs. You can undo this edit from the editor.

The confirmation box reports how many blocks will change. If the post has no GenerateBlocks blocks, there is nothing to update.

The block options menu has a smaller version of this tool that only renumbers the selected block and its inner blocks. See [Block menu tools](block-menu-tools.md).

## Import Pattern

**GenerateBlocks: Import Pattern**

Hidden when **Disable Pattern Inserter** is on. See [Block Settings](../settings/block-settings.md).

Opens a dialog with a text area. Paste WordPress block markup, then select **Import**.

Remote images are downloaded into the Media Library. The dialog lists each image as Waiting, Downloaded, or Kept original address. GenerateBlocks blocks in the pattern receive new unique IDs, including the selectors stored in their CSS, before the blocks are inserted.

If an image cannot be downloaded, the pattern is still inserted and that image keeps its original address. The dialog stays open so you can read which images failed.

If you do not have permission to upload files, images stay at their original addresses and unique IDs are still updated.
