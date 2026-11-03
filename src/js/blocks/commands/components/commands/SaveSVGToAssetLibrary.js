/**
 * Command to save a pasted SVG to the GenerateBlocks Pro Asset Library.
 */

import { useState } from 'react';
import { useCommand } from '@wordpress/commands';
import SaveSVGToAssetLibraryModal from '../modals/SaveSVGToAssetLibraryModal';
import GBIcon from '../icons/GBIcon';

/**
 * Whether the command should be available.
 *
 * @return {boolean} True when Pro is localized as active.
 */
const isProCommandEnabled = () => {
	if ( typeof mrshortcutsgbCommands !== 'undefined' ) {
		return 'true' === mrshortcutsgbCommands.isProActive;
	}
	if ( typeof mrshortcutsgbPatternInserter !== 'undefined' ) {
		return 'true' === mrshortcutsgbPatternInserter.isProActive;
	}
	return typeof generateBlocksPro !== 'undefined';
};

/**
 * Hook to register the Save SVG to Asset Library command.
 *
 * @return {JSX.Element} Modal for the command.
 */
export function useSaveSVGToAssetLibraryCommand() {
	const [ isOpen, setIsOpen ] = useState( false );

	useCommand( {
		name: 'mrshortcuts-gb-save-svg-to-asset-library',
		label: 'GenerateBlocks: Save SVG to Asset Library',
		keywords: [ 'generateblocks', 'svg', 'icon', 'asset', 'library', 'save', 'paste' ],
		icon: <GBIcon width="16" height="16" />,
		callback: ( { close } ) => {
			setIsOpen( true );
			if ( close ) {
				close();
			}
		},
		disabled: ! isProCommandEnabled(),
	} );

	return (
		<SaveSVGToAssetLibraryModal
			isOpen={ isOpen }
			onClose={ () => setIsOpen( false ) }
			mode="paste"
		/>
	);
}
