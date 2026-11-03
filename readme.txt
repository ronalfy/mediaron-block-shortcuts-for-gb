=== MediaRon Block Shortcuts for GenerateBlocks ===
Tags: blocks, gutenberg, helpers, add-ons, gutenberg blocks
Requires at least: 7.0
Tested up to: 7.1
Stable tag: 1.1.0
Requires PHP: 8.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Enhance your GB experience with Block Shortcuts for GenerateBlocks, featuring a Pattern Importer, v1 to v2 transforms, container shortcuts, and more.

== Description ==

MediaRon Block Shortcuts for GenerateBlocks is an add-on for <a href="https://generatepress.com/">GenerateBlocks</a> that brings additional functionality and enhancements to your block editing experience. Key features include:

1. **Pattern Importer**: Easily import remote patterns, including all images and unique IDs, ensuring no style conflicts.
2. **Version 1 to Version 2 Blocks Converter**: Stuck on an old v1 site? Convert v1 to v2 blocks with a quick transform, or surgically behind a useful contextual menu shortcut.
3. **Adobe Font Support**: Integrate Adobe Fonts from popular font plugins like <a href="https://wordpress.org/plugins/custom-typekit-fonts/">Astra’s Typekit plugin</a> and <a href="https://creativethemes.com/blocksy/docs/extensions/adobe-typekit-fonts/">Blocksy’s Adobe Font module</a>.
4. **Container Block Wrapping and Unwrapping**: Select multiple blocks and wrap them in a Container block with ease. Just as easily, you can unwrap the container via a contextual shortcut.
5. **Transform the Group block to a Container**: Convert Group blocks into Container blocks, maintaining all internal blocks.
6. **Command Palette Shortcuts**: Access GenerateBlocks settings quickly with shortcut commands in the block editor’s Command Palette. This includes a post-wide v1 to v2 block conversion shortcut. Other commands allow for quick regeneration of GenerateBlocks styles, and a command for outlining different blocks such as grids and containers.
7. **Unique ID Generation**: Avoid style conflicts by generating new unique IDs for duplicated or copied blocks. This is still very useful today.
8. **Build Styles for Select Post Types and Templates**: Have GenerateBlocks regenerate site-wide styles based on your selected post types or FSE templates.
9. **Useful Block Commands**: Convert all paragraph blocks into Text blocks (with paragraphs being selected) as well as converting all headlines into a Text block with appropriate headings selected.
10. **Add a Global Menu Toolbar Shortcut**: The current admin bar only shows overlays. With Block Shortcuts, you can see all available menu items from a top-level admin menu in the toolbar in both the admin and the frontend.

MediaRon Block Shortcuts for GenerateBlocks is perfect for users looking to streamline their GenerateBlocks workflow and add more versatility to the block editor design experience.

> The source code for this plugin <a href="https://github.com/ronalfy/mediaron-block-shortcuts-for-gb">is open source and available on GitHub</a>.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/mediaron-block-shortcuts-for-gb` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Use the plugin via the block editor in your WordPress site.

A <a href="https://generatepress.com/pricing/">GeneratePress One subscription</a> is recommended, but not required for this plugin to work.

This plugin <a href="https://wordpress.org/plugins/generateblocks/">requires GenerateBlocks</a> to work.

== Frequently Asked Questions ==

= What shortcuts does this plugin provide to GenerateBlocks? =

* The ability to wrap any block in a container via a contextual menu shortcut.
* The ability to unwrap any container or grid into its parent via a contextual menu shortcut.
* Transform a shape block into a linked button or Text block via block transforms and contextual menu shortcut.
* Regenerate all unique IDs via a very useful contextual menu shortcut.
* Transform a Group block into a container block, and even unwrap group blocks via a contextual menu shortcut.
* Clear all block styles for a block using a contextual menu shortcut.
* Toggle outlines for all containers and grids for a post via a useful command (using CMD+K).
* Transform v1 blocks into v2+ via a contextual menu shortcut.
* Transform all v1 blocks into v2+ via a useful command (using CMD+K).
* Via an admin setting, convert headline markdown syntax into a Headline block (now a Text block with appropriate headings).

= How does this plugin help with v1 block migration? =

With two very useful shortcuts.

1. A contextual menu (best used in the List View) allows you to convert the selected blocks from v1 to v2+.
2. A command (using CMD+K) that'll convert all v1 blocks into v2 at once.

The plugin also allows you to load v1 blocks alongside v2 blocks, with labels clearly separating the two so you can tell which block version you're dealing with.

= What is the Pattern Importer Block and how does it work? =
The Pattern Importer allows you to import GenerateBlocks patterns, automatically generating unique IDs and importing remote images inline, which is perfect for copying patterns from live to local in seconds.

= Is this plugin free? =

Yes, free as in beer. It was called "GB Extras" when it was a pro plugin, but the parent company had to close its doors. Rather than let a useful tool languish on GitHub unnoticed, I've decided to release it for free on .org to be open-source and freely available as long as possible.

== Screenshots ==

1. Wrap any block or group of blocks in a container using the contextual menu shortcut.
2. Convert any v1 block to v2 with a quick contextual shortcut.
3. Easily convert all v1 blocks to v2 with a simple CMD+K and selecting a conversion.
4. Change a Shape block into a linkable button with a contextual shortcut.
5. Quick shortcuts allow you to wrap in a container, clear block styles, and regenerate unique IDs.
6. Useful commands for outlining all Container and Grid blocks, converting v1 to v2, and converting all paragraph and headlines to Text blocks.
7. Admin Menu Bar shortcuts allow you to quickly access your favorite section of GenerateBlocks directly from the toolbar.
8. Useful admin settings such as showing v1 and v2 blocks together with different labels. Also markdown to the Text block is very useful.
9. Generate new GB styles when a post type is updated or inserted, such as with FSE templates and template parts.

== Changelog ==

= 1.1.0 =
* Released 2026-11-03
* New: Add SVGs to the asset library from the block editor, either via contextual shortcut or command palette.
* New: Generate Unique IDs from the command palette for the entire post.

= 1.0.0 =
* Initial WordPress.org release.

== Upgrade Notice ==

= 1.1.0 =
Add SVGs to the asset library from the block editor, either via contextual shortcut or command palette. Generate Unique IDs from the command palette for the entire post.