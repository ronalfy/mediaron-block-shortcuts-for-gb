/**
 * Command to generate new unique IDs for every GenerateBlocks block in the post.
 */

import { useState, useEffect } from 'react';
import { useCommand } from '@wordpress/commands';
import { select } from '@wordpress/data';
import GenerateUniqueIdsModal from '../modals/GenerateUniqueIdsModal';
import { countUniqueIdTargets, regenerateAllUniqueIds } from '../../utils/uniqueIds';
import GBIcon from '../icons/GBIcon';

/**
 * Hook to register the Generate Unique IDs command.
 *
 * @return {JSX.Element|null} The confirmation modal.
 */
export function useGenerateUniqueIdsCommand() {
	const [ isOpen, setIsOpen ] = useState( false );
	const [ generating, setGenerating ] = useState( false );
	const [ blockCount, setBlockCount ] = useState( 0 );

	useEffect( () => {
		if ( isOpen ) {
			const blocks = select( 'core/block-editor' ).getBlocks();
			setBlockCount( countUniqueIdTargets( blocks ) );
		}
	}, [ isOpen ] );

	useCommand( {
		name: 'mrshortcuts-gb-generate-unique-ids',
		label: 'GenerateBlocks: Generate New Unique IDs',
		searchLabel: 'Generate new unique IDs for every GenerateBlocks block in this post or page',
		keywords: [ 'generateblocks', 'unique', 'id', 'uniqueid', 'regenerate', 'css', 'duplicate', 'query', 'bulk' ],
		icon: <GBIcon width="16" height="16" />,
		callback: () => {
			setIsOpen( true );
		},
		context: 'block-editor',
	} );

	const handleConfirm = async() => {
		setGenerating( true );
		try {
			await regenerateAllUniqueIds();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.error( 'Error generating unique IDs:', error );
		} finally {
			setIsOpen( false );
			setGenerating( false );
		}
	};

	return (
		<GenerateUniqueIdsModal
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			onConfirm={ handleConfirm }
			generating={ generating }
			blockCount={ blockCount }
		/>
	);
}
