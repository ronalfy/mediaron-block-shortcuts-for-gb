/**
 * Intercept block-markup paste, download remote images, and refresh unique IDs.
 */

import { isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import { dispatch, select, subscribe } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { collectDocumentUniqueIds } from '../commands/utils/uniqueIds';
import {
	finishPastePatternDialog,
	markPastePatternImage,
	openPastePatternDialog,
} from './PastePatternDialog';
import {
	collectRemoteImageUrls,
	getBlockMarkupFromClipboard,
	processPatternMarkup,
} from './processPattern';

const NOTICE_ID = 'mrshortcuts-gb-paste-pattern';
const EDITOR_TARGET = '.block-editor-writing-flow, .editor-visual-editor, .block-editor-list-view, .edit-post-visual-editor, .edit-site-visual-editor';

let processing = false;

/**
 * Whether paste pattern processing is enabled for this editor load.
 *
 * @return {boolean} True when the Block Settings toggle is on.
 */
function isPasteProcessingEnabled() {
	return window.mrshortcutsgbPatternInserter?.enablePastePatternProcessing === 'true';
}

/**
 * Whether this user can upload sideloaded images.
 *
 * @return {boolean} True when the REST permission check would pass.
 */
function canSideloadImages() {
	return window.mrshortcutsgbPatternInserter?.canSideloadImages === 'true';
}

/**
 * Read clipboard fields without throwing on unsupported types.
 *
 * @param {ClipboardEvent} event Paste event.
 * @return {Object} Clipboard text and file count.
 */
function readClipboard( event ) {
	const data = event.clipboardData;
	if ( ! data ) {
		return {
			richText: '',
			html: '',
			plain: '',
			fileCount: 0,
		};
	}

	let richText = '';
	try {
		richText = data.getData( 'rich-text' ) || '';
	} catch ( error ) {
		richText = '';
	}

	return {
		richText,
		html: data.getData( 'text/html' ) || '',
		plain: data.getData( 'text/plain' ) || '',
		fileCount: data.files?.length || 0,
	};
}

/**
 * Whether the paste landed in the block editor canvas or list view.
 *
 * Sidebar inputs, including the Pattern Inserter textarea, stay native.
 *
 * @param {ClipboardEvent} event Paste event.
 * @return {boolean} True when this paste should be considered.
 */
function shouldHandlePasteEvent( event ) {
	const target = event.target;
	const doc = target?.ownerDocument;
	if ( ! doc || ! target?.closest ) {
		return false;
	}

	// Text fields, including the Pattern Inserter box inside the canvas, stay native.
	if ( target.closest( 'input, textarea, select' ) ) {
		return false;
	}

	const iframe = window.document.querySelector( 'iframe[name="editor-canvas"]' );
	if ( iframe && iframe.contentDocument === doc ) {
		return true;
	}

	return !! target.closest( EDITOR_TARGET );
}

/**
 * Show or replace the pattern import snackbar.
 *
 * @param {string} status  Notice status.
 * @param {string} message Notice text.
 */
function showNotice( status, message ) {
	dispatch( 'core/notices' ).createNotice( status, message, {
		id: NOTICE_ID,
		type: 'snackbar',
		isDismissible: true,
	} );
}

/**
 * Snapshot where the pasted blocks should land.
 *
 * The download is async, so the caret may move before insert.
 *
 * @return {Object} Selection snapshot.
 */
function captureInsertionTarget() {
	const editor = select( 'core/block-editor' );
	const selected = editor.getSelectedBlockClientIds?.() || [];
	const selectionStart = editor.getSelectionStart?.() || {};
	const selectionEnd = editor.getSelectionEnd?.() || {};
	const block = selected.length === 1 ? editor.getBlock( selected[ 0 ] ) : null;
	const content = block?.attributes?.content;
	const isEmptyParagraph = block?.name === 'core/paragraph' && ! content;
	const fullySelected = !! editor.__unstableIsFullySelected?.();

	return {
		selected: [ ...selected ],
		rootClientId: selected.length ? ( editor.getBlockRootClientId( selected[ 0 ] ) || '' ) : '',
		index: selected.length === 1 ? editor.getBlockIndex( selected[ 0 ] ) : null,
		multi: !! editor.hasMultiSelection?.(),
		fullySelected,
		isEmptyTarget: !! ( block && ( isEmptyParagraph || isUnmodifiedDefaultBlock( block ) ) ),
		selectionStart,
		selectionEnd,
	};
}

/**
 * Put the caret back where it was when the paste started.
 *
 * @param {Object} target Selection snapshot.
 */
function restoreSelection( target ) {
	const start = target.selectionStart;
	if ( ! start?.clientId || 'number' !== typeof start.offset ) {
		return;
	}
	dispatch( 'core/block-editor' ).selectionChange(
		start.clientId,
		start.attributeKey,
		start.offset,
		target.selectionEnd?.offset
	);
}

/**
 * Insert processed blocks at the snapshotted selection.
 *
 * @param {Array}  blocks Parsed blocks.
 * @param {Object} target Selection snapshot.
 */
function insertProcessedBlocks( blocks, target ) {
	const editorDispatch = dispatch( 'core/block-editor' );
	const selected = target.selected || [];

	if ( ! selected.length ) {
		const order = select( 'core/block-editor' ).getBlockOrder( target.rootClientId || '' );
		editorDispatch.insertBlocks( blocks, order.length, target.rootClientId || undefined );
		return;
	}

	if ( target.multi || target.fullySelected || target.isEmptyTarget ) {
		editorDispatch.replaceBlocks( selected, blocks, blocks.length - 1, -1 );
		return;
	}

	const start = target.selectionStart;
	const hasCaret = start && 'number' === typeof start.offset;
	if ( hasCaret && 'function' === typeof editorDispatch.__unstableSplitSelection ) {
		restoreSelection( target );
		const beforeIds = new Set( select( 'core/block-editor' ).getClientIdsWithDescendants() );
		editorDispatch.__unstableSplitSelection( blocks );
		const inserted = select( 'core/block-editor' ).getClientIdsWithDescendants().some( ( clientId ) => ! beforeIds.has( clientId ) );
		if ( inserted ) {
			return;
		}
	}

	const index = null === target.index || 'undefined' === typeof target.index ? selected.length : target.index + 1;
	editorDispatch.insertBlocks( blocks, index, target.rootClientId || undefined );
}

/**
 * Let the dialog paint before the downloads start.
 *
 * @return {Promise<void>} Resolves after two frames.
 */
function waitForDialogPaint() {
	return new Promise( ( resolve ) => {
		window.requestAnimationFrame( () => {
			window.requestAnimationFrame( resolve );
		} );
	} );
}

/**
 * Download images, then insert the pattern.
 *
 * The dialog stays open until it is closed so a fast local download is still visible.
 *
 * @param {string} markup Block markup.
 * @param {Object} target Selection snapshot.
 */
async function importPastedPattern( markup, target ) {
	const editor = select( 'core/block-editor' );
	const reservedIds = collectDocumentUniqueIds( editor.getBlocks?.() || [] );
	const remoteUrls = collectRemoteImageUrls( markup );
	let failed = 0;

	openPastePatternDialog( remoteUrls );
	await waitForDialogPaint();

	try {
		const blocks = await processPatternMarkup( markup, {
			sideload: true,
			reservedIds,
			onProgress: ( done, total, failedCount, image ) => {
				failed = failedCount;
				if ( image?.url ) {
					markPastePatternImage( image.url, image.ok ? 'downloaded' : 'failed' );
				}
			},
		} );

		if ( ! blocks.length ) {
			finishPastePatternDialog( {
				phase: 'error',
				message: __( 'The pasted pattern could not be read.', 'mediaron-block-shortcuts-for-gb' ),
			} );
			return;
		}

		insertProcessedBlocks( blocks, target );
		if ( failed ) {
			finishPastePatternDialog( {
				phase: 'warning',
				message: __( 'Some images could not be downloaded. Those images kept their original addresses. The pattern has been inserted.', 'mediaron-block-shortcuts-for-gb' ),
			} );
		} else {
			finishPastePatternDialog( {
				phase: 'done',
				message: __( 'The images were downloaded and the pattern has been inserted.', 'mediaron-block-shortcuts-for-gb' ),
			} );
		}
	} catch ( error ) {
		finishPastePatternDialog( {
			phase: 'error',
			message: __( 'The pasted pattern could not be imported.', 'mediaron-block-shortcuts-for-gb' ),
		} );
	}
}

/**
 * Capture-phase paste handler.
 *
 * @param {ClipboardEvent} event Paste event.
 */
function onPaste( event ) {
	if ( event.defaultPrevented && ! processing ) {
		return;
	}
	if ( ! shouldHandlePasteEvent( event ) ) {
		return;
	}

	const clipboard = readClipboard( event );
	if ( clipboard.richText === 'true' ) {
		return;
	}

	const markup = getBlockMarkupFromClipboard( clipboard.html, clipboard.plain );
	if ( ! markup ) {
		return;
	}

	const remoteUrls = collectRemoteImageUrls( markup );
	const shouldSideload = remoteUrls.length > 0 && canSideloadImages();

	if ( processing ) {
		if ( shouldSideload || /generateblocks(?:-pro)?\//.test( markup ) ) {
			event.preventDefault();
			event.stopImmediatePropagation();
			showNotice(
				'info',
				__( 'Still importing the previous pattern.', 'mediaron-block-shortcuts-for-gb' )
			);
		}
		return;
	}

	if ( shouldSideload ) {
		event.preventDefault();
		event.stopImmediatePropagation();
		processing = true;
		const target = captureInsertionTarget();
		importPastedPattern( markup, target ).finally( () => {
			processing = false;
		} );
		return;
	}

	if ( ! /generateblocks(?:-pro)?\//.test( markup ) ) {
		return;
	}

	event.preventDefault();
	event.stopImmediatePropagation();
	processing = true;
	const target = captureInsertionTarget();
	const reservedIds = collectDocumentUniqueIds( select( 'core/block-editor' ).getBlocks?.() || [] );
	processPatternMarkup( markup, {
		sideload: false,
		reservedIds,
	} ).then( ( blocks ) => {
		if ( blocks?.length ) {
			insertProcessedBlocks( blocks, target );
		}
	} ).finally( () => {
		processing = false;
	} );
}

/**
 * Bind the capture listener once per document.
 *
 * @param {Document} doc Document that receives paste events.
 */
function bindDocument( doc ) {
	if ( ! doc?.documentElement || doc.documentElement.dataset.mrshortcutsPasteBound ) {
		return;
	}
	doc.documentElement.dataset.mrshortcutsPasteBound = '1';
	doc.addEventListener( 'paste', onPaste, true );
}

/**
 * Start paste handling when the setting is enabled.
 */
function initPastePatternProcessing() {
	if ( ! isPasteProcessingEnabled() || window.mrshortcutsGbPastePatternBound ) {
		return;
	}
	window.mrshortcutsGbPastePatternBound = true;
	bindDocument( document );
	subscribe( () => {
		const iframe = document.querySelector( 'iframe[name="editor-canvas"]' );
		if ( iframe?.contentDocument?.documentElement ) {
			bindDocument( iframe.contentDocument );
		}
	} );
}

initPastePatternProcessing();
