/**
 * Modal for importing pattern markup from the command palette.
 */

import { useEffect, useState } from 'react';
import { isUnmodifiedDefaultBlock } from '@wordpress/blocks';
import {
	Button,
	Modal,
	Notice,
	Spinner,
	TextareaControl,
} from '@wordpress/components';
import { dispatch, select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { collectDocumentUniqueIds } from '../../utils/uniqueIds';
import { collectRemoteImageUrls, processPatternMarkup } from '../../../utils/processPattern';

/**
 * Remember where to insert, using the selection at the moment Import is clicked.
 *
 * @return {Object} Insertion target.
 */
function captureInsertionTarget() {
	const editor = select( 'core/block-editor' );
	const selected = editor.getSelectedBlockClientIds?.() || [];
	const block = 1 === selected.length ? editor.getBlock( selected[ 0 ] ) : null;
	const content = block?.attributes?.content;
	const isEmptyParagraph = 'core/paragraph' === block?.name && ! content;
	const isEmptyTarget = !! ( block && ( isEmptyParagraph || isUnmodifiedDefaultBlock( block ) ) );

	if ( 1 === selected.length && isEmptyTarget ) {
		return {
			mode: 'replace',
			clientIds: selected,
		};
	}

	if ( selected.length ) {
		const anchor = selected[ selected.length - 1 ];
		return {
			mode: 'after',
			rootClientId: editor.getBlockRootClientId( anchor ) || undefined,
			index: editor.getBlockIndex( anchor ),
		};
	}

	return {
		mode: 'append',
		index: editor.getBlockOrder( '' ).length,
	};
}

/**
 * Insert imported blocks at a captured selection.
 *
 * @param {Array}  blocks Parsed blocks.
 * @param {Object} target Insertion target from `captureInsertionTarget`.
 */
function insertImportedBlocks( blocks, target ) {
	const editorDispatch = dispatch( 'core/block-editor' );

	if ( 'replace' === target.mode ) {
		editorDispatch.replaceBlocks( target.clientIds, blocks, blocks.length - 1, -1 );
		return;
	}

	if ( 'after' === target.mode ) {
		editorDispatch.insertBlocks( blocks, target.index + 1, target.rootClientId );
		return;
	}

	editorDispatch.insertBlocks( blocks, target.index );
}

/**
 * Show a readable image address.
 *
 * @param {string} url Raw or escaped URL.
 * @return {string} Display URL.
 */
function displayUrl( url ) {
	return ( url || '' ).replace( /\\\//g, '/' );
}

/**
 * Status label for one image row.
 *
 * @param {string} status Row status.
 * @return {string} Label.
 */
function statusLabel( status ) {
	if ( 'downloaded' === status ) {
		return __( 'Downloaded', 'mediaron-block-shortcuts-for-gb' );
	}
	if ( 'failed' === status ) {
		return __( 'Kept original address', 'mediaron-block-shortcuts-for-gb' );
	}
	return __( 'Waiting', 'mediaron-block-shortcuts-for-gb' );
}

/**
 * Import Pattern modal.
 *
 * @param {Object}   props         Component props.
 * @param {boolean}  props.isOpen  Whether the modal is visible.
 * @param {Function} props.onClose Close callback.
 * @return {JSX.Element|null} Modal, or null when closed.
 */
const ImportPatternModal = ( { isOpen, onClose } ) => {
	const [ markup, setMarkup ] = useState( '' );
	const [ importing, setImporting ] = useState( false );
	const [ error, setError ] = useState( '' );
	const [ images, setImages ] = useState( [] );
	const [ message, setMessage ] = useState( '' );
	const [ finished, setFinished ] = useState( false );

	useEffect( () => {
		if ( isOpen ) {
			return;
		}
		setMarkup( '' );
		setImporting( false );
		setError( '' );
		setImages( [] );
		setMessage( '' );
		setFinished( false );
	}, [ isOpen ] );

	if ( ! isOpen ) {
		return null;
	}

	const settings = 'undefined' !== typeof mrshortcutsgbCommands ? mrshortcutsgbCommands : {};
	const canSideload = 'true' === settings.canSideloadImages;
	const done = images.filter( ( image ) => 'pending' !== image.status ).length;

	const onImport = async() => {
		setError( '' );
		setMessage( '' );
		setFinished( false );

		if ( ! markup.includes( '<!-- wp:' ) ) {
			setError( __( 'Paste WordPress block markup. It should include <!-- wp: comments.', 'mediaron-block-shortcuts-for-gb' ) );
			return;
		}

		const remoteUrls = collectRemoteImageUrls( markup );
		const sideload = canSideload && remoteUrls.length > 0;
		setImages( sideload ? remoteUrls.map( ( url ) => ( { url, status: 'pending' } ) ) : [] );
		setImporting( true );

		try {
			const insertionTarget = captureInsertionTarget();
			let failed = 0;
			const blocks = await processPatternMarkup( markup, {
				sideload,
				reservedIds: collectDocumentUniqueIds( select( 'core/block-editor' ).getBlocks?.() || [] ),
				restUrl: settings.restUrl,
				restNonce: settings.restNonce,
				onProgress: ( progressDone, total, failedCount, image ) => {
					failed = failedCount;
					if ( image?.url ) {
						setImages( ( current ) => current.map( ( row ) => (
							row.url === image.url ? { ...row, status: image.ok ? 'downloaded' : 'failed' } : row
						) ) );
					}
				},
			} );

			const inserted = !! blocks.length;
			if ( inserted ) {
				insertImportedBlocks( blocks, insertionTarget );
			}

			if ( ! inserted ) {
				setError( __( 'The pattern could not be read.', 'mediaron-block-shortcuts-for-gb' ) );
				setImporting( false );
				return;
			}

			if ( ! canSideload && remoteUrls.length ) {
				setMessage( __( 'Images were left at their original addresses. GenerateBlocks unique IDs were updated and the pattern has been inserted.', 'mediaron-block-shortcuts-for-gb' ) );
				setFinished( true );
				setImporting( false );
				return;
			}

			if ( failed ) {
				setMessage( __( 'Some images could not be downloaded. Those images kept their original addresses. The pattern has been inserted.', 'mediaron-block-shortcuts-for-gb' ) );
				setFinished( true );
				setImporting( false );
				return;
			}

			onClose();
		} catch ( importError ) {
			setError( __( 'The pattern could not be imported.', 'mediaron-block-shortcuts-for-gb' ) );
			setImporting( false );
		}
	};

	return (
		<Modal
			title={ __( 'Import Pattern', 'mediaron-block-shortcuts-for-gb' ) }
			isDismissible={ ! importing }
			shouldCloseOnClickOutside={ false }
			shouldCloseOnEsc={ ! importing }
			onRequestClose={ onClose }
			size="medium"
		>
			<TextareaControl
				label={ __( 'Pattern markup', 'mediaron-block-shortcuts-for-gb' ) }
				help={ __( 'Paste WordPress block markup. Remote images are downloaded, and GenerateBlocks blocks receive new unique IDs.', 'mediaron-block-shortcuts-for-gb' ) }
				value={ markup }
				onChange={ setMarkup }
				disabled={ importing || finished }
				rows={ 8 }
			/>
			{ !! error && (
				<Notice status="error" isDismissible={ false }>
					{ error }
				</Notice>
			) }
			{ !! message && (
				<Notice status={ finished && ! images.some( ( image ) => 'failed' === image.status ) ? 'info' : 'warning' } isDismissible={ false }>
					{ message }
				</Notice>
			) }
			{ importing && !! images.length && (
				<p style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
					<Spinner />
					{ sprintf(
						/* translators: 1: images finished, 2: total images. */
						__( 'Importing images (%1$d of %2$d)…', 'mediaron-block-shortcuts-for-gb' ),
						done,
						images.length
					) }
				</p>
			) }
			{ !! images.length && (
				<ul style={ { maxHeight: '240px', overflow: 'auto', margin: '0 0 16px', padding: 0, listStyle: 'none' } }>
					{ images.map( ( image ) => (
						<li
							key={ image.url }
							style={ { display: 'flex', gap: '12px', padding: '8px 0', borderTop: '1px solid #dcdcde' } }
						>
							<strong style={ { flex: '0 0 11em' } }>{ statusLabel( image.status ) }</strong>
							<span style={ { wordBreak: 'break-all' } }>{ displayUrl( image.url ) }</span>
						</li>
					) ) }
				</ul>
			) }
			<div style={ { display: 'flex', justifyContent: 'flex-end', gap: '10px' } }>
				{ finished ? (
					<Button variant="primary" onClick={ onClose }>
						{ __( 'Close', 'mediaron-block-shortcuts-for-gb' ) }
					</Button>
				) : (
					<>
						<Button variant="secondary" onClick={ onClose } disabled={ importing }>
							{ __( 'Cancel', 'mediaron-block-shortcuts-for-gb' ) }
						</Button>
						<Button
							variant="primary"
							onClick={ onImport }
							disabled={ ! markup.trim() || importing }
							isBusy={ importing }
						>
							{ importing
								? __( 'Importing…', 'mediaron-block-shortcuts-for-gb' )
								: __( 'Import', 'mediaron-block-shortcuts-for-gb' ) }
						</Button>
					</>
				) }
			</div>
		</Modal>
	);
};

export default ImportPatternModal;
