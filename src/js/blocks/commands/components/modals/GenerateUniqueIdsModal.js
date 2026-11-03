/**
 * Modal for generating new unique IDs across the current post.
 */

import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * GenerateUniqueIdsModal component.
 *
 * @param {Object}   props            Component props.
 * @param {boolean}  props.isOpen     Whether the modal is visible.
 * @param {Function} props.onClose    Callback when the modal is closed.
 * @param {Function} props.onConfirm  Callback when generation is confirmed.
 * @param {boolean}  props.generating Whether generation is in progress.
 * @param {number}   props.blockCount Number of blocks that will change.
 * @return {JSX.Element|null} The GenerateUniqueIdsModal component.
 */
const GenerateUniqueIdsModal = ( { isOpen, onClose, onConfirm, generating, blockCount } ) => {
	if ( ! isOpen ) {
		return null;
	}

	return (
		<Modal
			isDismissible={ ! generating }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ onClose }
			title={ __( 'Generate New Unique IDs', 'mediaron-block-shortcuts-for-gb' ) }
			size="medium"
		>
			<div style={ { marginBottom: '20px' } }>
				<p>
					{ __( 'This will generate a new unique ID for every GenerateBlocks block in this post.', 'mediaron-block-shortcuts-for-gb' ) }
				</p>
				{ blockCount > 0 && (
					<p>
						{ __( 'Found ', 'mediaron-block-shortcuts-for-gb' ) }
						<strong>{ blockCount }</strong>
						{ 1 === blockCount
							? __( ' block to update.', 'mediaron-block-shortcuts-for-gb' )
							: __( ' blocks to update.', 'mediaron-block-shortcuts-for-gb' ) }
					</p>
				) }
				{ blockCount > 0 && (
					<p>
						{ __( 'Query loop pagination keys use these IDs and will change. You can undo this from the editor.', 'mediaron-block-shortcuts-for-gb' ) }
					</p>
				) }
				{ 0 === blockCount && (
					<p>
						{ __( 'No GenerateBlocks blocks found to update.', 'mediaron-block-shortcuts-for-gb' ) }
					</p>
				) }
			</div>
			<div style={ { display: 'flex', justifyContent: 'flex-end', gap: '10px' } }>
				<Button
					variant="primary"
					onClick={ onConfirm }
					disabled={ generating || 0 === blockCount }
					isBusy={ generating }
				>
					{ generating
						? __( 'Generating…', 'mediaron-block-shortcuts-for-gb' )
						: __( 'Generate Unique IDs', 'mediaron-block-shortcuts-for-gb' ) }
				</Button>
				<Button
					variant="secondary"
					onClick={ onClose }
					disabled={ generating }
				>
					{ __( 'Cancel', 'mediaron-block-shortcuts-for-gb' ) }
				</Button>
			</div>
		</Modal>
	);
};

export default GenerateUniqueIdsModal;
