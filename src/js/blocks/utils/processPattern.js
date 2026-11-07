/**
 * Download remote images in block markup and regenerate GenerateBlocks unique IDs.
 *
 * Paste handling and a later command can both call `processPatternMarkup`.
 */

import { parse } from '@wordpress/blocks';
import SendCommand from './SendCommand';
import { regenerateUniqueIdsForBlocks } from '../commands/utils/uniqueIds';

const IMAGE_EXTENSION = /\.(?:jpe?g|png|gif|webp|avif)$/i;
const RAW_URL = /https?:(?:\/\/|\\\/\\\/)[^\s"'<>]+/gi;
const MEDIA_ID_BLOCKS = [
	'generateblocks/media',
	'generateblocks/image',
	'core/media-text',
];

/**
 * Strip browser clipboard wrappers so block comments can be parsed.
 *
 * @param {string} html Clipboard HTML.
 * @return {string} Block markup.
 */
export function normalizePastedMarkup( html ) {
	let markup = html || '';
	markup = markup.replace( /<meta[^>]+>/gi, '' );
	markup = markup.replace( /^\s*<html[^>]*>\s*<body[^>]*>(?:\s*<!--\s*StartFragment\s*-->)?/i, '' );
	markup = markup.replace( /(?:<!--\s*EndFragment\s*-->\s*)?<\/body>\s*<\/html>\s*$/i, '' );

	const startToken = '<!--StartFragment-->';
	const start = markup.indexOf( startToken );
	if ( start !== -1 ) {
		markup = markup.slice( start + startToken.length );
		const end = markup.indexOf( '<!--EndFragment-->' );
		if ( end !== -1 ) {
			markup = markup.slice( 0, end );
		}
	}

	return markup.trim();
}

/**
 * Choose clipboard text that contains WordPress block markup.
 *
 * @param {string} html  Clipboard HTML.
 * @param {string} plain Clipboard plain text.
 * @return {string} Block markup, or an empty string.
 */
export function getBlockMarkupFromClipboard( html, plain ) {
	const normalizedHtml = normalizePastedMarkup( html );
	if ( normalizedHtml.includes( '<!-- wp:' ) ) {
		return normalizedHtml;
	}
	if ( ( plain || '' ).includes( '<!-- wp:' ) ) {
		return plain;
	}
	return '';
}

/**
 * Unique remote image URLs in markup whose host is not this site.
 *
 * @param {string} markup Block markup or other pasted text.
 * @return {string[]} Image URLs as they appear in the markup.
 */
export function collectRemoteImageUrls( markup ) {
	if ( ! markup ) {
		return [];
	}

	const found = new Set();
	const host = window.location.host;
	const matches = markup.match( RAW_URL ) || [];

	matches.forEach( ( rawMatch ) => {
		const raw = rawMatch.replace( /[),.;]+$/g, '' );
		const normalized = raw.replace( /\\\//g, '/' ).replace( /&amp;/g, '&' );
		let parsed;
		try {
			parsed = new URL( normalized );
		} catch ( error ) {
			return;
		}
		if ( parsed.protocol !== 'http:' && parsed.protocol !== 'https:' ) {
			return;
		}
		if ( parsed.host === host ) {
			return;
		}
		if ( ! IMAGE_EXTENSION.test( parsed.pathname ) ) {
			return;
		}
		found.add( raw );
	} );

	return [ ...found ];
}

/**
 * Replace downloaded image URLs in markup, longest match first.
 *
 * @param {string} markup       Original markup.
 * @param {Map}    replacements Raw URL to `{ url, id }`.
 * @return {string} Updated markup.
 */
function rewriteImageUrls( markup, replacements ) {
	let next = markup;
	const entries = [ ...replacements.entries() ].sort( ( a, b ) => b[ 0 ].length - a[ 0 ].length );

	entries.forEach( ( [ raw, value ] ) => {
		if ( ! value?.url || value.url === raw ) {
			return;
		}
		next = next.split( raw ).join( value.url );
		const normalized = raw.replace( /\\\//g, '/' );
		if ( normalized !== raw && normalized !== value.url ) {
			next = next.split( normalized ).join( value.url );
		}
	} );

	return next;
}

/**
 * Point attachment id fields at the sideloaded file when the URL matches.
 *
 * @param {*}   value    Attribute value.
 * @param {Map} byNewUrl Local URL to attachment id.
 */
function mapAttributeIds( value, byNewUrl ) {
	if ( Array.isArray( value ) ) {
		value.forEach( ( item ) => mapAttributeIds( item, byNewUrl ) );
		return;
	}
	if ( ! value || 'object' !== typeof value ) {
		return;
	}

	const nestedUrl = value.image && 'string' === typeof value.image.url ? value.image.url : '';
	if ( nestedUrl && byNewUrl.has( nestedUrl ) && Object.prototype.hasOwnProperty.call( value, 'id' ) ) {
		value.id = byNewUrl.get( nestedUrl );
	}

	const directKey = [ 'url', 'src', 'mediaUrl' ].find(
		( key ) => 'string' === typeof value[ key ] && byNewUrl.has( value[ key ] )
	);
	if ( directKey ) {
		const attachmentId = byNewUrl.get( value[ directKey ] );
		if ( Object.prototype.hasOwnProperty.call( value, 'mediaId' ) ) {
			value.mediaId = attachmentId;
		} else if ( Object.prototype.hasOwnProperty.call( value, 'id' ) ) {
			value.id = attachmentId;
		}
	}

	Object.keys( value ).forEach( ( key ) => {
		mapAttributeIds( value[ key ], byNewUrl );
	} );
}

/**
 * Whether a block's attributes or saved HTML still contain a URL.
 *
 * @param {Object} block    Parsed block.
 * @param {string} imageUrl Local image URL.
 * @return {boolean} True when the URL is part of this block.
 */
function blockContainsUrl( block, imageUrl ) {
	const attributes = JSON.stringify( block?.attributes || {} );
	if ( attributes.includes( imageUrl ) ) {
		return true;
	}
	const inner = `${ ( block?.innerContent || [] ).join( '' ) }${ block?.innerHTML || '' }`;
	return inner.includes( imageUrl );
}

/**
 * Update media and gallery ids after URLs have been rewritten.
 *
 * @param {Array} blocks       Parsed blocks.
 * @param {Map}   replacements Raw URL to `{ url, id }`.
 */
function applyAttachmentIds( blocks, replacements ) {
	const byNewUrl = new Map();
	replacements.forEach( ( value ) => {
		if ( value?.id > 0 && value.url ) {
			byNewUrl.set( value.url, value.id );
		}
	} );
	if ( ! byNewUrl.size ) {
		return;
	}

	const walk = ( block ) => {
		if ( ! block || 'core/block' === block.name ) {
			return;
		}
		if ( block.attributes ) {
			mapAttributeIds( block.attributes, byNewUrl );
		}
		if (
			block.attributes &&
			MEDIA_ID_BLOCKS.includes( block.name ) &&
			Object.prototype.hasOwnProperty.call( block.attributes, 'mediaId' )
		) {
			for ( const [ imageUrl, attachmentId ] of byNewUrl.entries() ) {
				if ( blockContainsUrl( block, imageUrl ) ) {
					block.attributes.mediaId = attachmentId;
					break;
				}
			}
		}
		if ( 'core/gallery' === block.name && Array.isArray( block.attributes?.images ) ) {
			const ids = block.attributes.images
				.map( ( image ) => parseInt( image?.id, 10 ) )
				.filter( ( id ) => id > 0 );
			if ( ids.length ) {
				block.attributes.ids = ids;
			}
		}
		( block.innerBlocks || [] ).forEach( walk );
	};

	( blocks || [] ).forEach( walk );
}

/**
 * Download one remote image.
 *
 * @param {string} rawUrl    URL as it appears in the markup.
 * @param {string} restUrl   REST namespace URL.
 * @param {string} restNonce REST nonce.
 * @return {Promise<Object>} Replacement `{ rawUrl, url, id, failed }`.
 */
async function sideloadImage( rawUrl, restUrl, restNonce ) {
	const settings = window.mrshortcutsgbPatternInserter || {};
	const endpoint = `${ restUrl || settings.restUrl || '' }/process_image`;
	const normalized = rawUrl.replace( /\\\//g, '/' ).replace( /&amp;/g, '&' );

	try {
		const response = await SendCommand(
			restNonce || settings.restNonce,
			{
				imgUrl: normalized,
				imgAlt: '',
			},
			endpoint
		);
		const body = response?.data;
		if ( body?.success && body?.data?.attachmentUrl ) {
			const attachmentId = parseInt( body.data.attachmentId, 10 );
			return {
				rawUrl,
				url: body.data.attachmentUrl,
				id: attachmentId > 0 ? attachmentId : 0,
				failed: false,
			};
		}
	} catch ( error ) {
		// Keep the original URL when the download fails.
	}

	return {
		rawUrl,
		url: '',
		id: 0,
		failed: true,
	};
}

/**
 * Sideload remote images, then return blocks with new GenerateBlocks unique IDs.
 *
 * @param {string}   markup                Block markup.
 * @param {Object}   [options]             Options.
 * @param {Function} [options.onProgress]  Called with `( done, total, failed, image )`. `image` is `{ url, ok }`.
 * @param {Set}      [options.reservedIds] Unique IDs already used on the page.
 * @param {boolean}  [options.sideload]    When false, skip downloads.
 * @param {string}   [options.restUrl]     REST namespace URL. Falls back to the pattern inserter script.
 * @param {string}   [options.restNonce]   REST nonce. Falls back to the pattern inserter script.
 * @return {Promise<Array>} Parsed blocks.
 */
export async function processPatternMarkup( markup, options = {} ) {
	const {
		onProgress,
		reservedIds,
		sideload = true,
		restUrl = '',
		restNonce = '',
	} = options;
	const urls = sideload ? collectRemoteImageUrls( markup ) : [];
	const replacements = new Map();
	let done = 0;
	let failed = 0;

	if ( urls.length ) {
		await Promise.all( urls.map( async( rawUrl ) => {
			const result = await sideloadImage( rawUrl, restUrl, restNonce );
			if ( result.failed || ! result.url ) {
				failed += 1;
			} else {
				replacements.set( rawUrl, {
					url: result.url,
					id: result.id,
				} );
			}
			done += 1;
			if ( onProgress ) {
				onProgress( done, urls.length, failed, {
					url: rawUrl,
					ok: ! result.failed && !! result.url,
				} );
			}
		} ) );
	}

	const rewritten = rewriteImageUrls( markup, replacements );
	const blocks = parse( rewritten );
	applyAttachmentIds( blocks, replacements );
	return regenerateUniqueIdsForBlocks( blocks, reservedIds );
}
