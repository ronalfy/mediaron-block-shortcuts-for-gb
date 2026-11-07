/**
 * Block editor commands registration.
 */

import { registerPlugin } from '@wordpress/plugins';
import { useToggleContainerOutlinesCommand } from './components/commands/ToggleContainerOutlines';
import { useTransformV1ToV2Command } from './components/commands/TransformV1ToV2';
import { useTransformHeadingToGBTextCommand } from './components/commands/TransformHeadingToGBText';
import { useTransformParagraphToGBTextCommand } from './components/commands/TransformParagraphToGBText';
import { useSaveSVGToAssetLibraryCommand } from './components/commands/SaveSVGToAssetLibrary';
import { useGenerateUniqueIdsCommand } from './components/commands/GenerateUniqueIds';
import { useImportPatternCommand } from './components/commands/ImportPattern';

/**
 * Commands block editor component.
 *
 * @return {JSX.Element} The CommandsBlockEditor component.
 */
const CommandsBlockEditor = () => {
	useToggleContainerOutlinesCommand();
	const transformModal = useTransformV1ToV2Command();
	const headingTransformModal = useTransformHeadingToGBTextCommand();
	const paragraphTransformModal = useTransformParagraphToGBTextCommand();
	const saveSvgModal = useSaveSVGToAssetLibraryCommand();
	const generateUniqueIdsModal = useGenerateUniqueIdsCommand();
	const importPatternModal = useImportPatternCommand();

	// Return all modals (they handle their own visibility).
	return (
		<>
			{ transformModal }
			{ headingTransformModal }
			{ paragraphTransformModal }
			{ saveSvgModal }
			{ generateUniqueIdsModal }
			{ importPatternModal }
		</>
	);
};

registerPlugin( 'mrshortcuts-gb-commands-block-editor', {
	render: CommandsBlockEditor,
} );
