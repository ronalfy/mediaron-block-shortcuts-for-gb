---
title: "Markdown to Text"
slug: markdown-to-text
products: [block-shortcuts-for-gb]
sections: ["Settings"]
status: publish
order: 20
toc: true
---

# Markdown to Text

**Enable Markdown to Text Block** is in **GenerateBlocks → Shortcuts**, inside **Block Settings**.

WordPress normally turns a markdown heading prefix into a core Heading block. With this option on, the same prefix creates a GenerateBlocks Text block instead.

It is off by default. Select **Save Options**, then open the editor again.

## How to use it

In an empty paragraph in the block editor, type a heading prefix and a space, then the heading text. For example:

- `# Title` for a top-level heading
- `## Section` for the next level
- Additional `#` characters for deeper levels

Press Enter or otherwise accept the markdown shortcut the same way you would for a core Heading. The result is a GenerateBlocks Text block.

## When markdown shortcuts are unavailable

> [!WARNING]
> Markdown syntax is unavailable if the default block is set to the headline block. The Shortcuts screen shows that warning when both that default and **Enable Markdown to Text Block** are on.

Turn the option off again if you want markdown prefixes to create core Heading blocks.
