/**
 * Helpers for capturing SVGs into the GenerateBlocks Pro Asset Library.
 */

import { dispatch, select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

const SVG_BLOCKS = {
	'generateblocks/shape': 'html',
	'generateblocks/text': 'icon',
	'generateblocks/headline': 'icon',
	'generateblocks/button': 'icon',
};

const LIVE_ICONS_KEY = 'mrshortcutsgbLiveSvgIcons';
const FILTER_FLAG_KEY = 'mrshortcutsgbLiveSvgIconsFilterAdded';

/**
 * Shared live icon map so separate webpack bundles patch the same object.
 *
 * @return {Object} Live icon groups keyed like generateBlocksPro.svgIcons.
 */
function getLiveIcons() {
	if ( ! window[ LIVE_ICONS_KEY ] || 'object' !== typeof window[ LIVE_ICONS_KEY ] ) {
		window[ LIVE_ICONS_KEY ] = {};
	}

	return window[ LIVE_ICONS_KEY ];
}

/**
 * Collapse whitespace so equivalent SVGs compare as one library item.
 *
 * GenerateBlocks' IconLibrary uses `isPressed: icon === value` on the SVG
 * string, not the unique id, so duplicate markup all appear selected.
 *
 * @param {string} markup SVG markup.
 * @return {string} Normalized markup.
 */
function normalizeSvgMarkup( markup ) {
	if ( 'string' !== typeof markup ) {
		return '';
	}

	return markup.replace( /\s+/g, ' ' ).trim();
}

/**
 * Return the first svg id in a group whose markup matches.
 *
 * @param {Object} svgs Group svgs keyed by id.
 * @param {string} icon SVG markup.
 * @return {string} Matching id, or an empty string.
 */
function findExistingSvgId( svgs, icon ) {
	const normalized = normalizeSvgMarkup( icon );
	if ( ! normalized || ! svgs || 'object' !== typeof svgs ) {
		return '';
	}

	const ids = Object.keys( svgs );
	for ( let i = 0; i < ids.length; i++ ) {
		const item = svgs[ ids[ i ] ];
		if ( item && normalizeSvgMarkup( item.icon ) === normalized ) {
			return ids[ i ];
		}
	}

	return '';
}

/**
 * Keep one library tile per unique SVG string in each group.
 *
 * Built-in GenerateBlocks icons are React elements, not markup strings.
 * Those must be kept as-is or the picker would show only custom SVGs.
 *
 * @param {Object} sets Icon SVG sets.
 * @return {Object} Deduped sets.
 */
function dedupeSvgSetsByMarkup( sets ) {
	if ( ! sets || 'object' !== typeof sets ) {
		return sets;
	}

	const next = {};
	Object.keys( sets ).forEach( ( key ) => {
		const group = sets[ key ];
		if ( ! group || 'object' !== typeof group || ! group.svgs || 'object' !== typeof group.svgs ) {
			next[ key ] = group;
			return;
		}

		const svgs = {};
		const seen = {};
		Object.keys( group.svgs ).forEach( ( id ) => {
			const item = group.svgs[ id ];
			if ( ! item ) {
				return;
			}

			if ( 'string' !== typeof item.icon ) {
				svgs[ id ] = item;
				return;
			}

			const normalized = normalizeSvgMarkup( item.icon );
			if ( ! normalized || seen[ normalized ] ) {
				return;
			}

			seen[ normalized ] = true;
			svgs[ id ] = item;
		} );

		next[ key ] = {
			...group,
			svgs,
		};
	} );

	return next;
}

/**
 * Overlay live Asset Library groups without replacing built-in sets.
 *
 * @param {Object} sets      Filtered icon SVG sets.
 * @param {Object} liveIcons Live custom groups.
 * @return {Object} Merged sets.
 */
function mergeLiveIconSets( sets, liveIcons ) {
	const next = sets && 'object' === typeof sets ? { ...sets } : {};
	if ( ! liveIcons || 'object' !== typeof liveIcons ) {
		return next;
	}

	Object.keys( liveIcons ).forEach( ( key ) => {
		const liveGroup = liveIcons[ key ];
		if ( ! liveGroup || 'object' !== typeof liveGroup ) {
			return;
		}

		const existing = next[ key ];
		if ( ! existing || 'object' !== typeof existing ) {
			next[ key ] = liveGroup;
			return;
		}

		next[ key ] = {
			...existing,
			group: existing.group || liveGroup.group,
			svgs: {
				...( existing.svgs || {} ),
				...( liveGroup.svgs || {} ),
			},
		};
	} );

	return next;
}

if ( ! window[ FILTER_FLAG_KEY ] ) {
	window[ FILTER_FLAG_KEY ] = true;
	addFilter(
		'generateblocks.editor.iconSVGSets',
		'mrshortcuts-gb/live-asset-icons',
		( sets ) => mergeLiveIconSets( sets, getLiveIcons() )
	);
}

/**
 * Extract SVG markup from a supported GenerateBlocks block.
 *
 * @param {Object|null} block Selected block.
 * @return {string} SVG markup, or an empty string.
 */
export function extractSvgFromBlock( block ) {
	if ( ! block || ! block.name || ! block.attributes ) {
		return '';
	}

	const attributeName = SVG_BLOCKS[ block.name ];
	if ( ! attributeName ) {
		return '';
	}

	const markup = block.attributes[ attributeName ];
	if ( 'string' !== typeof markup || -1 === markup.toLowerCase().indexOf( '<svg' ) ) {
		return '';
	}

	return markup;
}

/**
 * Force GenerateBlocks inspector controls to re-run iconSVGSets filters.
 */
export function forceGenerateBlocksIconPickerRefresh() {
	const settings = select( 'core/block-editor' ).getSettings();
	dispatch( 'core/block-editor' ).updateSettings( {
		...settings,
		mrshortcutsGbIconLibraryRev: ( settings.mrshortcutsGbIconLibraryRev || 0 ) + 1,
	} );

	const clientId = select( 'core/block-editor' ).getSelectedBlockClientId();
	if ( ! clientId ) {
		return;
	}

	// Deselect/reselect remounts inspector controls that already rendered the icon list.
	dispatch( 'core/block-editor' ).clearSelectedBlock();
	window.requestAnimationFrame( () => {
		dispatch( 'core/block-editor' ).selectBlock( clientId );
	} );
}

/**
 * Patch Pro's localized icon list so the chooser sees a newly saved icon on next render.
 *
 * @param {Object}  icon            Saved icon payload from REST.
 * @param {string}  icon.group      Group label.
 * @param {string}  icon.groupKey   sanitize_key() group key used by Pro.
 * @param {string}  icon.id         Icon id.
 * @param {string}  icon.name       Icon label.
 * @param {string}  icon.icon       Sanitized SVG markup.
 * @param {Object}  options         Patch options.
 * @param {boolean} options.refresh Whether to remount inspector controls. Defaults to true.
 */
export function patchGenerateBlocksProIcons( { group, groupKey, id, name, icon }, options = {} ) {
	const key = groupKey || group;
	if ( ! key ) {
		return;
	}

	const liveIcons = getLiveIcons();
	const existingGroup =
		( typeof generateBlocksPro !== 'undefined' && generateBlocksPro.svgIcons && generateBlocksPro.svgIcons[ key ] ) ||
		liveIcons[ key ] || {
			group: group || key,
			svgs: {},
		};

	const existingSvgs = existingGroup.svgs || {};
	const existingId = findExistingSvgId( existingSvgs, icon );
	const resolvedId = existingId || id;
	const nextGroup = {
		group: existingGroup.group || group || key,
		svgs: {
			...existingSvgs,
			[ resolvedId ]: existingId && existingSvgs[ existingId ]
				? existingSvgs[ existingId ]
				: {
					label: name,
					icon,
				},
		},
	};

	const collapsedGroup = dedupeSvgSetsByMarkup( { [ key ]: nextGroup } )[ key ];
	liveIcons[ key ] = collapsedGroup;

	if ( typeof generateBlocksPro !== 'undefined' ) {
		if ( ! generateBlocksPro.svgIcons || 'object' !== typeof generateBlocksPro.svgIcons ) {
			generateBlocksPro.svgIcons = {};
		}
		generateBlocksPro.svgIcons[ key ] = collapsedGroup;
	}

	if ( false !== options.refresh ) {
		forceGenerateBlocksIconPickerRefresh();
	}
}
