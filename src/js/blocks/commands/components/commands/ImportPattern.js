/**
 * Command to import pattern markup, download remote images, and regenerate unique IDs.
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import ImportPatternModal from '../modals/ImportPatternModal';
import GBIcon from '../icons/GBIcon';

/**
 * Hook to register the Import Pattern command.
 *
 * @return {JSX.Element} Modal for the command.
 */
export function useImportPatternCommand() {
	const [ isOpen, setIsOpen ] = useState( false );

	useCommand( {
		name: 'mrshortcuts-gb-import-pattern',
		label: 'GenerateBlocks: Import Pattern',
		searchLabel: 'Import a pattern, download remote images, and regenerate unique IDs',
		keywords: [ 'generateblocks', 'pattern', 'import', 'paste', 'image', 'unique', 'id', 'uniqueid' ],
		icon: <GBIcon width="16" height="16" />,
		callback: ( { close } ) => {
			setIsOpen( true );
			if ( close ) {
				close();
			}
		},
		context: 'block-editor',
	} );

	return (
		<ImportPatternModal
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
		/>
	);
}
