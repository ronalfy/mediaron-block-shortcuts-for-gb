import { useEffect } from '@wordpress/element';
import { addFilter, removeFilter } from '@wordpress/hooks';
import { select, subscribe, useSelect } from '@wordpress/data';
import {
	registerBlockType,
	unregisterBlockType,
	getBlockTypes,
	unregisterBlockVariation,
	registerBlockVariation,
} from '@wordpress/blocks';
import { v1Blocks } from '../../utils/BlockTypes';

const originalTitles = new Map();
const originalLabels = new Map();
const originalVariationTitles = new Map();
const processedBlocks = new Set();

/**
 * Read the localized editor settings.
 *
 * @return {Object} Localized settings, or an empty object.
 */
function getInserterConfig() {
	return window.mrshortcutsgbPatternInserter || {};
}

/**
 * Whether a localized true/false flag is on.
 *
 * @param {string|boolean} value Localized flag.
 * @return {boolean} True when the flag is enabled.
 */
function isTruthySetting( value ) {
	return true === value || 'true' === value;
}

/**
 * Whether both GenerateBlocks versions stay visible.
 *
 * @return {boolean} True when v1 blocks are enabled.
 */
function isV1BlocksEnabled() {
	return isTruthySetting( getInserterConfig().enableV1Blocks );
}

/**
 * Whether general GenerateBlocks identification is on.
 *
 * @return {boolean} True when the GB suffix should be applied.
 */
function isIdentifyEnabled() {
	return isTruthySetting( getInserterConfig().identifyGenerateBlocks );
}

/**
 * Whether any title labeling pass should run.
 *
 * @return {boolean} True when general identification or version labels are on.
 */
function shouldLabelTitles() {
	return isIdentifyEnabled() || isV1BlocksEnabled();
}

/**
 * Whether a block belongs to GenerateBlocks or GenerateBlocks Pro.
 *
 * @param {string} name Block name.
 * @return {boolean} True for the generateblocks and generateblocks-pro namespaces.
 */
function isGenerateBlocksBlock( name ) {
	return (
		'string' === typeof name &&
		( name.startsWith( 'generateblocks/' ) ||
			name.startsWith( 'generateblocks-pro/' ) )
	);
}

/**
 * Trim a suffix for use in a block title.
 *
 * The suffix stays plain text. The inserter escapes it when the title is rendered.
 *
 * @param {string} suffix Raw suffix.
 * @return {string} Trimmed suffix, or an empty string.
 */
function cleanSuffix( suffix ) {
	return ( suffix || '' ).trim();
}

/**
 * Append one suffix when it has a value and is not already present.
 *
 * @param {string} title  Title to update.
 * @param {string} suffix Raw suffix.
 * @return {string} Title with the suffix, or the original title.
 */
function appendSuffix( title, suffix ) {
	const clean = cleanSuffix( suffix );
	if ( ! clean ) {
		return title;
	}
	const addition = ' ' + clean;
	if ( title.endsWith( addition ) ) {
		return title;
	}
	return title + addition;
}

/**
 * Version suffix for a GenerateBlocks block, when version labels are on.
 *
 * @param {string} blockName Block name.
 * @return {string} v1 or v2 suffix, or an empty string.
 */
function getVersionSuffix( blockName ) {
	if ( ! isV1BlocksEnabled() ) {
		return '';
	}
	const config = getInserterConfig();
	return v1Blocks.includes( blockName )
		? config.v1BlockSuffix
		: config.v2BlockSuffix;
}

/**
 * Build a display title from the original block title.
 *
 * @param {string} originalTitle Unmodified title.
 * @param {string} blockName     Block name.
 * @return {string} Title with the active suffixes.
 */
function composeTitle( originalTitle, blockName ) {
	let title = originalTitle || '';
	if ( isIdentifyEnabled() ) {
		title = appendSuffix( title, getInserterConfig().generateBlocksSuffix );
	}
	title = appendSuffix( title, getVersionSuffix( blockName ) );
	return title;
}

/**
 * Whether this block has a suffix that should change its title.
 *
 * @param {string} blockName Block name.
 * @return {boolean} True when a non-empty suffix applies.
 */
function hasActiveSuffix( blockName ) {
	if (
		isIdentifyEnabled() &&
		cleanSuffix( getInserterConfig().generateBlocksSuffix )
	) {
		return true;
	}
	return '' !== cleanSuffix( getVersionSuffix( blockName ) );
}

/**
 * Remember the first title seen for a block.
 *
 * @param {string} name  Block name.
 * @param {string} title Title to store when this block is new.
 * @return {string} Original title.
 */
function rememberOriginalTitle( name, title ) {
	if ( ! originalTitles.has( name ) ) {
		originalTitles.set( name, title );
	}
	return originalTitles.get( name );
}

/**
 * Remember the first label callback seen for a block.
 *
 * @param {string}   name  Block name.
 * @param {Function} label Label callback.
 * @return {Function|undefined} Original label callback.
 */
function rememberOriginalLabel( name, label ) {
	if ( ! originalLabels.has( name ) ) {
		originalLabels.set(
			name,
			label && label.isMrshortcutsLabel ? undefined : label
		);
	}
	return originalLabels.get( name );
}

/**
 * Read a label callback result as plain text.
 *
 * Strings pass through. Objects that provide toPlainText() are converted before suffixes are appended.
 *
 * @param {*} label Label callback result.
 * @return {*} Plain text for a string or label object, otherwise the original result.
 */
function labelToPlainText( label ) {
	if ( label && 'function' === typeof label.toPlainText ) {
		return label.toPlainText();
	}
	return label;
}

/**
 * Label callback that keeps custom list-view names and appends suffixes once.
 *
 * @param {Function|undefined} originalLabel Original label callback.
 * @param {string}             originalTitle Unmodified block title.
 * @param {string}             blockName     Block name.
 * @return {Function} Wrapped label callback.
 */
function wrapLabel( originalLabel, originalTitle, blockName ) {
	const wrapped = ( attrs, context ) => {
		const customName = attrs?.metadata?.name || '';
		if ( 'list-view' === context?.context && customName ) {
			return customName;
		}
		const composed = composeTitle( originalTitle, blockName );
		if ( 'function' !== typeof originalLabel ) {
			return composed;
		}
		const base = labelToPlainText( originalLabel( attrs, context ) );
		if ( ! base || base === originalTitle || base === composed ) {
			return composed;
		}
		return appendSuffix(
			appendSuffix(
				base,
				isIdentifyEnabled()
					? getInserterConfig().generateBlocksSuffix
					: ''
			),
			getVersionSuffix( blockName )
		);
	};
	wrapped.isMrshortcutsLabel = true;
	return wrapped;
}

/**
 * Add the v1 inserter category.
 *
 * @param {Array} categories Existing categories.
 * @return {Array} Categories including the v1 category.
 */
function addGenerateBlocksV1Category( categories ) {
	return [
		...categories,
		{
			slug: 'generateblocks-v1',
			title: 'GenerateBlocks V1',
			icon: null,
		},
	];
}

/**
 * Move v1 blocks into their category and apply identification to GB titles.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} Updated settings.
 */
function modifyBlockRegistration( settings, name ) {
	let next = settings;
	if ( v1Blocks.includes( name ) && isV1BlocksEnabled() ) {
		next = {
			...next,
			category: 'generateblocks-v1',
		};
	}
	if (
		! isGenerateBlocksBlock( name ) ||
		! shouldLabelTitles() ||
		! hasActiveSuffix( name )
	) {
		return next;
	}

	const originalTitle = rememberOriginalTitle( name, next.title );
	const originalLabel = rememberOriginalLabel(
		name,
		next.__experimentalLabel
	);
	return {
		...next,
		title: composeTitle( originalTitle, name ),
		__experimentalLabel: wrapLabel( originalLabel, originalTitle, name ),
	};
}

/**
 * Return variation copies labeled from their original titles.
 *
 * @param {Array|undefined} variations Registered variations.
 * @param {string}          blockName  Block name.
 * @return {Array|undefined} Variations with composed titles.
 */
function labelBlockVariations( variations, blockName ) {
	if (
		! shouldLabelTitles() ||
		! isGenerateBlocksBlock( blockName ) ||
		! Array.isArray( variations )
	) {
		return variations;
	}
	return variations.map( ( variation ) => {
		if ( ! variation?.name || ! hasActiveSuffix( blockName ) ) {
			return variation;
		}
		const key = blockName + '/' + variation.name;
		if ( ! originalVariationTitles.has( key ) ) {
			originalVariationTitles.set( key, variation.title );
		}
		const nextTitle = composeTitle(
			originalVariationTitles.get( key ),
			blockName
		);
		if ( variation.title === nextTitle ) {
			return variation;
		}
		return {
			...variation,
			title: nextTitle,
		};
	} );
}

addFilter(
	'blocks.registerBlockType',
	'gbcm/modify-block-category',
	modifyBlockRegistration,
	1000
);

addFilter(
	'blocks.getCategories',
	'gbcm/add-v1-category',
	addGenerateBlocksV1Category
);

addFilter(
	'blocks.getBlockVariations',
	'mrshortcutsgb/label-block-variations',
	labelBlockVariations
);

if ( isV1BlocksEnabled() ) {
	removeFilter( 'blocks.registerBlockType', 'generateblocks/disableBlocks' );
}

/**
 * Whether a registered block still needs its title or label updated.
 *
 * @param {Object} block Registered block type.
 * @return {boolean} True when the block should be re-registered.
 */
function needsRelabel( block ) {
	const originalTitle = rememberOriginalTitle( block.name, block.title );
	if ( block.title !== composeTitle( originalTitle, block.name ) ) {
		return true;
	}
	if (
		hasActiveSuffix( block.name ) &&
		! block.__experimentalLabel?.isMrshortcutsLabel
	) {
		return true;
	}
	return (
		isV1BlocksEnabled() &&
		v1Blocks.includes( block.name ) &&
		'generateblocks-v1' !== block.category
	);
}

/**
 * Re-register a block from its original title so labeling runs once.
 *
 * @param {Object} block Registered block type.
 */
function relabelBlock( block ) {
	const originalTitle = rememberOriginalTitle( block.name, block.title );
	const originalLabel = rememberOriginalLabel(
		block.name,
		block.__experimentalLabel
	);
	unregisterBlockType( block.name );
	registerBlockType( block.name, {
		...block,
		title: originalTitle,
		__experimentalLabel: originalLabel,
		category:
			isV1BlocksEnabled() && v1Blocks.includes( block.name )
				? 'generateblocks-v1'
				: block.category,
	} );
}

/**
 * Variation records from the block store, without the read filter.
 *
 * getBlockVariations() applies blocks.getBlockVariations, which returns copies
 * with composed titles. The inserter and List View read the store itself.
 *
 * @param {string} blockName Block name.
 * @return {Array} Stored variations.
 */
function getStoredVariations( blockName ) {
	return select( 'core/blocks' ).getBlockVariations( blockName ) || [];
}

/**
 * Write composed variation titles back to the variations store.
 *
 * registerBlockVariation() does not update blockType.variations, and WordPress
 * reads inserter and List View titles from the variations store.
 *
 * @param {string} blockName Block name.
 */
function relabelVariations( blockName ) {
	if (
		! shouldLabelTitles() ||
		! isGenerateBlocksBlock( blockName ) ||
		! hasActiveSuffix( blockName )
	) {
		return;
	}
	const variations = getStoredVariations( blockName );
	variations.forEach( ( variation ) => {
		if ( ! variation?.name || 'string' !== typeof variation.title ) {
			return;
		}
		const key = blockName + '/' + variation.name;
		if ( ! originalVariationTitles.has( key ) ) {
			originalVariationTitles.set( key, variation.title );
		}
		const nextTitle = composeTitle(
			originalVariationTitles.get( key ),
			blockName
		);
		if ( variation.title === nextTitle ) {
			return;
		}
		unregisterBlockVariation( blockName, variation.name );
		registerBlockVariation( blockName, {
			...variation,
			title: nextTitle,
		} );
	} );
}

let lastVariationSignature = '';
let isLabelingVariations = false;

/**
 * Signature of GenerateBlocks variation titles currently in the store.
 *
 * @return {string} Stable signature for the current variation titles.
 */
function getVariationSignature() {
	const parts = [];
	getBlockTypes().forEach( ( block ) => {
		if ( ! isGenerateBlocksBlock( block.name ) ) {
			return;
		}
		const variations = getStoredVariations( block.name );
		variations.forEach( ( variation ) => {
			if ( ! variation?.name ) {
				return;
			}
			parts.push(
				block.name +
					'/' +
					variation.name +
					'\u0000' +
					( variation.title || '' )
			);
		} );
	} );
	return parts.join( '\u0001' );
}

/**
 * Compose titles for variations that are already registered.
 *
 * Safe to call repeatedly. Skips work when titles are unchanged and ignores
 * the store updates this function itself dispatches.
 */
function labelRegisteredVariations() {
	if ( isLabelingVariations || ! shouldLabelTitles() ) {
		return;
	}
	const signature = getVariationSignature();
	if ( signature === lastVariationSignature ) {
		return;
	}
	isLabelingVariations = true;
	try {
		getBlockTypes().forEach( ( block ) => {
			if ( isGenerateBlocksBlock( block.name ) ) {
				relabelVariations( block.name );
			}
		} );
		lastVariationSignature = getVariationSignature();
	} finally {
		isLabelingVariations = false;
	}
}

if ( shouldLabelTitles() ) {
	subscribe( labelRegisteredVariations, 'core/blocks' );
}

/**
 * Re-register GenerateBlocks blocks that were registered before this script loaded.
 *
 * @return {null} This plugin renders nothing.
 */
function GenerateBlocksCustomLabels() {
	const allBlocks = useSelect(
		( select ) => select( 'core/blocks' ).getBlockTypes(),
		[]
	);

	useEffect( () => {
		if ( ! shouldLabelTitles() || allBlocks.length === 0 ) {
			return;
		}

		isLabelingVariations = true;
		try {
			allBlocks.forEach( ( block ) => {
				if ( ! isGenerateBlocksBlock( block.name ) ) {
					return;
				}
				if ( ! processedBlocks.has( block.name ) ) {
					processedBlocks.add( block.name );
					if ( needsRelabel( block ) ) {
						relabelBlock( block );
					}
				}
				relabelVariations( block.name );
			} );
			lastVariationSignature = getVariationSignature();
		} finally {
			isLabelingVariations = false;
		}
	}, [ allBlocks ] );

	return null;
}

wp.plugins.registerPlugin( 'generateblocks-custom', {
	render: GenerateBlocksCustomLabels,
} );
