import { registerBlockType } from '@wordpress/blocks';
import Edit from './block';
import metaData from './block.json';

const PatternIcon = ( props ) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={ 512 }
		height={ 512 }
		viewBox="0 0 520 520"
		{ ...props }
	>
		<path
			fill="currentColor"
			d="M50 450h20v20H50zM50 410h20v20H50zM50 370h20v20H50zM50 330h20v20H50zM50 290h20v20H50zM450 210h20v20h-20zM450 170h20v20h-20zM450 130h20v20h-20zM450 90h20v20h-20zM450 50h20v20h-20zM90 450h20v20H90zM130 450h20v20h-20zM170 450h20v20h-20zM210 450h20v20h-20zM290 50h20v20h-20zM330 50h20v20h-20zM370 50h20v20h-20zM410 50h20v20h-20zM460 250H270V60c0-5.523-4.478-10-10-10H60c-5.523 0-10 4.477-10 10v200c0 5.522 4.477 10 10 10h190v190c0 5.522 4.477 10 10 10h200c5.522 0 10-4.478 10-10V260c0-5.523-4.478-10-10-10zM70 70h180v180H70zm380 380H270V270h180z"
		/>
	</svg>
);

const patternInserterDisabled =
	typeof mrshortcutsgbPatternInserter !== 'undefined' &&
	'true' === ( mrshortcutsgbPatternInserter.disablePatternInserter || 'false' );

if ( ! patternInserterDisabled ) {
	registerBlockType( metaData, {
		edit: Edit,
		save() {
			return null;
		},
		icon: PatternIcon,
	} );
}
