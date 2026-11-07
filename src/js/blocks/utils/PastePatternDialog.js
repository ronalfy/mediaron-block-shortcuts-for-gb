/**
 * Dialog that shows remote image downloads for a pasted pattern.
 */

import { useEffect, useState } from '@wordpress/element';
import { Button, Modal, Spinner } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

const listeners = new Set();

let dialogState = {
	open: false,
	phase: 'working',
	images: [],
	message: '',
};

/**
 * Notify the dialog that its state changed.
 */
function emit() {
	listeners.forEach( ( listener ) => listener() );
}

/**
 * Subscribe to dialog state.
 *
 * @param {Function} listener Listener.
 * @return {Function} Unsubscribe.
 */
function subscribe( listener ) {
	listeners.add( listener );
	return () => listeners.delete( listener );
}

/**
 * Read the current dialog state.
 *
 * @return {Object} Dialog state.
 */
function getSnapshot() {
	return dialogState;
}

/**
 * Open the dialog with one row per remote image.
 *
 * @param {string[]} urls Remote image URLs.
 */
export function openPastePatternDialog( urls ) {
	dialogState = {
		open: true,
		phase: 'working',
		images: ( urls || [] ).map( ( url ) => ( {
			url,
			status: 'pending',
		} ) ),
		message: '',
	};
	emit();
}

/**
 * Mark one image as downloaded or failed.
 *
 * @param {string} url    Image URL from the paste.
 * @param {string} status `downloaded` or `failed`.
 */
export function markPastePatternImage( url, status ) {
	dialogState = {
		...dialogState,
		images: dialogState.images.map( ( image ) => (
			image.url === url ? { ...image, status } : image
		) ),
	};
	emit();
}

/**
 * Leave the dialog open with a finished message until it is closed.
 *
 * @param {Object} result         Result.
 * @param {string} result.phase   `done`, `warning`, or `error`.
 * @param {string} result.message Message shown above the image list.
 */
export function finishPastePatternDialog( { phase, message } ) {
	dialogState = {
		...dialogState,
		phase,
		message,
	};
	emit();
}

/**
 * Close the dialog.
 */
export function closePastePatternDialog() {
	dialogState = {
		open: false,
		phase: 'working',
		images: [],
		message: '',
	};
	emit();
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
 * Paste pattern image dialog.
 *
 * @return {JSX.Element|null} Dialog.
 */
function PastePatternDialog() {
	const [ dialog, setDialog ] = useState( getSnapshot );
	useEffect( () => subscribe( () => setDialog( getSnapshot() ) ), [] );
	if ( ! dialog.open ) {
		return null;
	}

	const total = dialog.images.length;
	const done = dialog.images.filter( ( image ) => 'pending' !== image.status ).length;
	const working = 'working' === dialog.phase;

	return (
		<Modal
			title={ working
				? __( 'Importing pattern images', 'mediaron-block-shortcuts-for-gb' )
				: __( 'Pattern images', 'mediaron-block-shortcuts-for-gb' ) }
			isDismissible={ ! working }
			shouldCloseOnClickOutside={ false }
			shouldCloseOnEsc={ ! working }
			onRequestClose={ closePastePatternDialog }
			size="medium"
		>
			{ working && (
				<p style={ { display: 'flex', alignItems: 'center', gap: '8px' } }>
					<Spinner />
					{ sprintf(
						/* translators: 1: images finished, 2: total images. */
						__( 'Importing images (%1$d of %2$d)…', 'mediaron-block-shortcuts-for-gb' ),
						done,
						total
					) }
				</p>
			) }
			{ !! dialog.message && (
				<p>{ dialog.message }</p>
			) }
			<ul style={ { maxHeight: '240px', overflow: 'auto', margin: '0 0 16px', padding: 0, listStyle: 'none' } }>
				{ dialog.images.map( ( image ) => (
					<li
						key={ image.url }
						style={ { display: 'flex', gap: '12px', padding: '8px 0', borderTop: '1px solid #dcdcde' } }
					>
						<strong style={ { flex: '0 0 11em' } }>{ statusLabel( image.status ) }</strong>
						<span style={ { wordBreak: 'break-all' } }>{ displayUrl( image.url ) }</span>
					</li>
				) ) }
			</ul>
			{ ! working && (
				<div style={ { display: 'flex', justifyContent: 'flex-end' } }>
					<Button variant="primary" onClick={ closePastePatternDialog }>
						{ __( 'Close', 'mediaron-block-shortcuts-for-gb' ) }
					</Button>
				</div>
			) }
		</Modal>
	);
}

registerPlugin( 'mrshortcuts-gb-paste-pattern-dialog', {
	render: PastePatternDialog,
} );
