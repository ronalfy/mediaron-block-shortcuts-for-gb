---
title: "Auto-Regenerate Styles on Save"
slug: auto-regenerate-styles
products: [block-shortcuts-for-gb]
sections: ["Settings"]
status: publish
order: 40
toc: true
---

# Auto-Regenerate Styles on Save

Open **GenerateBlocks → Shortcuts** and use the **Auto-Regenerate Styles on Save** panel.

Check the post types that should clear GenerateBlocks CSS caches when they are saved. Styles are rebuilt the next time a page that needs them is loaded. This is useful for template parts and other shared content, where a save should refresh styles used on many pages.

Nothing is checked by default. Select **Save Options** after you change the list.

Autosaves and revisions do not clear the cache. A normal update or publish does.

## Related

Which post types receive GenerateBlocks styles in the first place is set under [Post Type Styles](post-type-styles.md).

To rebuild CSS immediately, without waiting for the next save, use **GenerateBlocks: Generate CSS Files** in the [command palette](../editor/command-palette.md).
