/**
 * Regenerate GenerateBlocks unique IDs across the current editor document.
 */

import { dispatch, select } from '@wordpress/data';

const SYNCED_PATTERN = 'core/block';

/**
 * Whether the block is a GenerateBlocks or GenerateBlocks Pro block.
 *
 * @param {Object} block Block object.
 * @return {boolean} True when the block name is a GenerateBlocks block.
 */
function isGenerateBlocksBlock( block ) {
	const name = block?.name || '';
	return name.startsWith( 'generateblocks/' ) || name.startsWith( 'generateblocks-pro/' );
}

/**
 * Whether the block stores a uniqueId attribute.
 *
 * @param {Object} block Block object.
 * @return {boolean} True when uniqueId is an attribute.
 */
function hasUniqueIdAttribute( block ) {
	return !! block?.attributes && Object.prototype.hasOwnProperty.call( block.attributes, 'uniqueId' );
}

/**
 * Whether this block should receive a new unique ID.
 *
 * @param {Object} block Block object.
 * @return {boolean} True when the command updates the block.
 */
function isUniqueIdTarget( block ) {
	return isGenerateBlocksBlock( block ) && hasUniqueIdAttribute( block );
}

/**
 * Add every uniqueId in a subtree to the reserved set.
 *
 * @param {Object} block Block object.
 * @param {Set}    used  Reserved IDs.
 */
function collectSubtreeIds( block, used ) {
	if ( ! block ) {
		return;
	}

	const uniqueId = block.attributes?.uniqueId;
	if ( typeof uniqueId === 'string' && uniqueId ) {
		used.add( uniqueId );
	}

	( block.innerBlocks || [] ).forEach( ( innerBlock ) => {
		collectSubtreeIds( innerBlock, used );
	} );
}

/**
 * Reserve IDs that this command will leave unchanged.
 *
 * Synced patterns are included so new IDs do not collide with pattern blocks.
 *
 * @param {Array} blocks Root blocks.
 * @param {Set}   used   Reserved IDs.
 */
function collectRetainedIds( blocks, used ) {
	const walk = ( block ) => {
		if ( ! block ) {
			return;
		}

		if ( SYNCED_PATTERN === block.name ) {
			collectSubtreeIds( block, used );
			return;
		}

		if ( ! isUniqueIdTarget( block ) ) {
			const uniqueId = block.attributes?.uniqueId;
			if ( typeof uniqueId === 'string' && uniqueId ) {
				used.add( uniqueId );
			}
		}

		( block.innerBlocks || [] ).forEach( walk );
	};

	( blocks || [] ).forEach( walk );
}

/**
 * Count GenerateBlocks blocks that will receive a new unique ID.
 *
 * @param {Array} blocks Root blocks.
 * @return {number} Target count.
 */
export function countUniqueIdTargets( blocks ) {
	let count = 0;

	const walk = ( block ) => {
		if ( ! block || SYNCED_PATTERN === block.name ) {
			return;
		}

		if ( isUniqueIdTarget( block ) ) {
			count++;
		}

		( block.innerBlocks || [] ).forEach( walk );
	};

	( blocks || [] ).forEach( walk );
	return count;
}

/**
 * Create a short unique ID that is not already reserved.
 *
 * @param {Set}    used      Reserved IDs. The new ID is added to this set.
 * @param {string} currentId The block's current unique ID.
 * @return {string} New unique ID.
 */
function createUniqueId( used, currentId ) {
	let id = '';
	let attempts = 0;

	do {
		id = Math.random().toString( 36 ).slice( 2, 9 );
		attempts++;
	} while ( ( id.length < 6 || used.has( id ) || id === currentId ) && attempts < 20 );

	if ( id.length < 6 || used.has( id ) || id === currentId ) {
		id = `${ Math.random().toString( 36 ).slice( 2 ) }${ attempts.toString( 36 ) }`.slice( 0, 8 );
	}

	used.add( id );
	return id;
}

/**
 * Rewrite compiled CSS so selectors follow the new unique ID.
 *
 * @param {string} css       Compiled CSS.
 * @param {string} currentId Previous unique ID.
 * @param {string} nextId    Next unique ID.
 * @return {string} CSS with the previous ID replaced.
 */
function replaceIdInCss( css, currentId, nextId ) {
	if ( ! currentId || 'string' !== typeof css || ! css.includes( currentId ) ) {
		return css;
	}

	return css.split( currentId ).join( nextId );
}

/**
 * Return a block tree with new unique IDs.
 *
 * Synced patterns are returned unchanged.
 *
 * @param {Object} block Block object.
 * @param {Set}    used  Reserved IDs.
 * @return {Object} Original block or a copy with updated IDs.
 */
function regenerateBlock( block, used ) {
	if ( ! block || SYNCED_PATTERN === block.name ) {
		return block;
	}

	const originalInner = block.innerBlocks || [];
	const innerBlocks = originalInner.map( ( innerBlock ) => regenerateBlock( innerBlock, used ) );
	const innerChanged = innerBlocks.some( ( innerBlock, index ) => innerBlock !== originalInner[ index ] );

	if ( ! isUniqueIdTarget( block ) ) {
		if ( ! innerChanged ) {
			return block;
		}

		return {
			...block,
			innerBlocks,
		};
	}

	const currentId = 'string' === typeof block.attributes.uniqueId ? block.attributes.uniqueId : '';
	const nextId = createUniqueId( used, currentId );
	const attributes = {
		...block.attributes,
		uniqueId: nextId,
	};

	if ( 'string' === typeof attributes.css ) {
		attributes.css = replaceIdInCss( attributes.css, currentId, nextId );
	}

	return {
		...block,
		attributes,
		innerBlocks,
	};
}

/**
 * Build the next root block list with regenerated unique IDs.
 *
 * @param {Array} blocks Root blocks.
 * @return {Array} Next root blocks.
 */
export function regenerateUniqueIds( blocks ) {
	const used = new Set();
	const roots = blocks || [];
	collectRetainedIds( roots, used );
	return roots.map( ( block ) => regenerateBlock( block, used ) );
}

/**
 * Replace unique IDs for every GenerateBlocks block in the editor.
 *
 * @return {Promise<number>} Number of blocks updated.
 */
export async function regenerateAllUniqueIds() {
	const blocks = select( 'core/block-editor' ).getBlocks();
	const count = countUniqueIdTargets( blocks );

	if ( ! count ) {
		return 0;
	}

	const nextBlocks = regenerateUniqueIds( blocks );
	await dispatch( 'core/block-editor' ).replaceBlocks(
		blocks.map( ( block ) => block.clientId ),
		nextBlocks
	);

	return count;
}
