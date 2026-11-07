import { useEffect, useState } from 'react';
import { cloneBlock } from '@wordpress/blocks';
import { PluginBlockSettingsMenuItem } from '@wordpress/editor';
import { useSelect, useDispatch, store, select } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import './js/blocks/pattern-importer/index.js';
import './js/blocks/utils/pastePattern.js';
import ContainerLogo from './js/blocks/components/ContainerIcon.js';
import ReplaceIcon from './js/blocks/components/ReplaceIcon.js';
import { v1Blocks, v2Blocks } from './js/blocks/utils/BlockTypes.js';
import { replaceUniqueIds } from './js/blocks/utils/ReplaceUniqueIds.js';
import {
	transformBlockSubtreeFromContext,
	hasV1BlockInSubtree,
} from './js/blocks/commands/utils/blockTransforms.js';
import { extractSvgFromBlock } from './js/blocks/utils/svgAssetLibrary';
import SaveSVGToAssetLibraryModal from './js/blocks/commands/components/modals/SaveSVGToAssetLibraryModal';

const UnGroupIcon = ( props ) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 640 512"
			width="24"
			height="24"
			{ ...props }
		>
			<path
				fill="currentColor"
				d="M0 64c0 29.8 20.4 54.9 48 62v100c-27.6 7.1-48 32.2-48 62 0 35.3 28.7 64 64 64 29.8 0 54.9-20.4 62-48h196c7.1 27.6 32.2 48 62 48 35.3 0 64-28.7 64-64 0-29.8-20.4-54.9-48-62V126c27.6-7.1 48-32.2 48-62 0-35.3-28.7-64-64-64-29.8 0-54.9 20.4-62 48H126C118.9 20.4 93.8 0 64 0 28.7 0 0 28.7 0 64zm322 16c5.8 22.5 23.5 40.2 46 46v100c-22.5 5.8-40.2 23.5-46 46H126c-5.8-22.5-23.5-40.2-46-46V126c22.5-5.8 40.2-23.5 46-46h196zm158 128h-16v32h50c5.8 22.5 23.5 40.2 46 46v100c-22.5 5.8-40.2 23.5-46 46H318c-5.8-22.5-23.5-40.2-46-46v-50h-32v50c-27.6 7.1-48 32.2-48 62 0 35.3 28.7 64 64 64 29.8 0 54.9-20.4 62-48h196c7.1 27.6 32.2 48 62 48 35.3 0 64-28.7 64-64 0-29.8-20.4-54.9-48-62V286c27.6-7.1 48-32.2 48-62 0-35.3-28.7-64-64-64-29.8 0-54.9 20.4-62 48h-34zm96 48a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-32 192a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm-288 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm96-192a32 32 0 1 1 64 0 32 32 0 1 1-64 0zM64 320a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM352 64a32 32 0 1 1 64 0 32 32 0 1 1-64 0zM64 96a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"
			/>
		</svg>
	);
};

/**
 * Link SVG Icon.
 *
 * @param {Object} props - The props object.
 * @return {JSX.Element} The LinkIcon component.
 */
const LinkIcon = ( props ) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 32 32"
			{ ...props }
		>
			<path
				d="M26.606 5.394a7.51 7.51 0 0 0-10.606 0l-.707.707a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.707-.707a3.5 3.5 0 0 1 4.95 4.95l-3.536 3.535a3.522 3.522 0 0 1-4.712.217l-.768-.641a1 1 0 0 0-1.408.127l-1.282 1.535a1 1 0 0 0 .127 1.409l.767.64a7.458 7.458 0 0 0 10.105-.459L26.607 16a7.5 7.5 0 0 0 0-10.606z"
				fill="currentColor"
			/>
			<path
				d="M15.293 23.071a1 1 0 0 0-1.414 0l-.707.707a3.5 3.5 0 0 1-4.95-4.95l3.536-3.535a3.52 3.52 0 0 1 4.712-.217l.768.641a1 1 0 0 0 1.408-.127l1.282-1.535a1 1 0 0 0-.127-1.409l-.767-.64a7.458 7.458 0 0 0-10.105.459L5.393 16A7.5 7.5 0 0 0 16 26.606l.707-.707a1 1 0 0 0 0-1.414z"
				fill="currentColor"
			/>
		</svg>
	);
};

const SaveLibraryIcon = ( props ) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			{ ...props }
		>
			<path
				d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

const ClearIcon = ( props ) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			fill="none"
			viewBox="0 0 97 97"
			{ ...props }
		>
			<g fill="currentColor">
				<path
					d="M66.145 13.156a8.694 8.694 0 1 1 15.43 8.015l-8.928 17.143a8.645 8.645 0 0 1-1.312 1.868c2.44 3.612 3.196 8.258 1.65 12.655a358.309 358.309 0 0 1-1.11 3.115.798.798 0 0 1-1.122.435l-28.81-15.056a.806.806 0 0 1-.222-1.254c.717-.795 1.415-1.592 2.085-2.376 3.152-3.689 7.822-5.775 12.538-5.62.054-.11.11-.22.17-.329zM37.719 44.991a.807.807 0 0 0-.923.126c-1.773 1.648-3.543 3.087-5.193 4.11-5.574 3.458-10.182 4.705-13.044 5.147a4.922 4.922 0 0 0-3.694 2.733c-.69 1.46-.639 3.372.705 4.853 1.48 1.63 3.672 3.789 6.834 6.386a.8.8 0 0 0 .665.165c2.212-.445 4.515-.865 6.525-1.915.584-.306 1.46-.85 2.558-1.793 1.094-.938 2.758-.837 3.718.225a2.52 2.52 0 0 1-.243 3.621c-1.388 1.19-2.596 1.965-3.553 2.466-.783.409-1.603.749-2.44 1.04-.636.22-.785 1.076-.233 1.461 1.593 1.11 3.33 2.269 5.223 3.473a83.238 83.238 0 0 0 2.86 1.738c.266.155.6.141.85-.039a34.027 34.027 0 0 0 3.464-2.826c2.146-2.013 3.997-4.23 5.494-6.782.73-1.24 2.332-1.678 3.58-.975s1.67 2.278.94 3.52c-1.752 2.986-3.92 5.6-6.435 7.959-.435.408-.908.83-1.417 1.26-.45.38-.37 1.105.164 1.354a75.51 75.51 0 0 0 7.707 3.113c2.674.904 5.533-.13 7.067-2.428 1.94-2.905 5.348-8.385 8.273-15.053.76-1.73 1.532-3.616 2.289-5.55a.798.798 0 0 0-.374-.997zM22.974 37.907a3.767 3.767 0 1 0 0-7.533 3.767 3.767 0 0 0 0 7.533zM12.72 49.485a3.767 3.767 0 1 0 0-7.533 3.767 3.767 0 0 0 0 7.533z"
					fill="currentColor"
				/>
			</g>
		</svg>
	);
};
// Run on load.
( function( wp ) {
	/**
	 * Add a toolbar option to wrap selected blocks in a container.
	 *
	 * Updated for v2 blocks.
	 */
	registerPlugin( 'mrshortcuts-gb-wrap-container', {
		render: () => {
			const [ clientIds, setClientIds ] = useState( [] );

			// Get the selected block clientIds.
			const { selectedBlocks, selectedBlock, selectedBlockCount, getMultiSelectedBlockClientIds } = useSelect(
				( select ) => {
					return {
						selectedBlocks:
							select( 'core/block-editor' ).getMultiSelectedBlocks(),
						selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
						selectedBlockCount: select( 'core/block-editor' ).getSelectedBlockCount(),
						getMultiSelectedBlockClientIds:
							select( 'core/block-editor' ).getMultiSelectedBlockClientIds,
					};
				},
				[]
			);

			const { replaceBlocks, replaceBlock } = useDispatch( store )( 'core/block-editor' );

			useEffect( () => {
				if ( selectedBlockCount > 1 ) {
					setClientIds( selectedBlocks );
				} else if ( selectedBlockCount === 1 ) {
					setClientIds( [ selectedBlock.clientId ] );
				}
			}, [ selectedBlocks, selectedBlock, selectedBlockCount ] );

			// If no blocks are selected, return.
			if ( clientIds.length === 0 ) {
				return null;
			}

			// If a block is selected, add toolbar option to wrap container.
			if ( clientIds.length > 0 ) {
				return (
					<PluginBlockSettingsMenuItem
						icon={ <ContainerLogo /> }
						label="Wrap in Container"
						onClick={ () => {
							if ( selectedBlockCount > 1 ) {
								const innerBlocks = [];
								clientIds.forEach( ( clientId ) => {
									innerBlocks.push( cloneBlock( clientId ) );
								} );
								replaceBlocks(
									getMultiSelectedBlockClientIds(),
									wp.blocks.createBlock( 'generateblocks/element', {}, innerBlocks )
								);
							} else {
								replaceBlock( selectedBlock.clientId, wp.blocks.createBlock( 'generateblocks/element', {}, [ cloneBlock( selectedBlock ) ] ) );
							}
						} }
					/>
				);
			}
			return null;
		},
	} );

	// Unique ID storing.
	const uniqueIds = [];
	/**
	 * Generate New Unique IDs for selected blocks.
	 *
	 * For v1 blocks.
	 */
	registerPlugin( 'mrshortcuts-gb-generate-unique-ids', {
		render: () => {
			const { selectedBlock } = useSelect( ( select ) => {
				return {
					selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
				};
			}, [] );

			const { replaceBlocks } = useDispatch( store )( 'core/block-editor' );
			/**
			 * Return early if no block is selected.
			 */
			if ( null === selectedBlock ) {
				return null;
			}

			// Get the block name.
			const { name } = selectedBlock;

			// If name contains `generateblocks`, proceed.
			if ( ! v1Blocks.includes( name ) && ! v2Blocks.includes( name ) ) {
				return null;
			}

			// If more than one block is selected, add toolbar option to replace the Unique ID.
			return (
				<PluginBlockSettingsMenuItem
					icon={ <ReplaceIcon /> }
					label="Generate New Unique IDs"
					onClick={ () => {
						const newBlock = replaceUniqueIds( selectedBlock ); // This gets the selected block and all innerBlocks.
						replaceBlocks( selectedBlock.clientId, newBlock );
					} }
				/>
			);
		},
	} );

	/**
	 * Clear block styles for v2 blocks.
	 */
	registerPlugin( 'mrshortcuts-gb-clear-block-styles', {
		render: () => {
			const { selectedBlock } = useSelect( ( select ) => {
				return {
					selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
				};
			}, [] );

			const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
			/**
			 * Return early if no block is selected.
			 */
			if ( null === selectedBlock ) {
				return null;
			}

			// Get the block name.
			const { name } = selectedBlock;

			// If name contains `generateblocks`, proceed.
			if ( ! v2Blocks.includes( name ) ) {
				return null;
			}

			// If more than one block is selected, add toolbar option to replace the Unique ID.
			return (
				<PluginBlockSettingsMenuItem
					icon={ <ClearIcon /> }
					label="Clear Block Styles"
					onClick={ () => {
						updateBlockAttributes( selectedBlock.clientId, { styles: {} } );
					} }
				/>
			);
		},
	} );

	/**
	 * Register a plugin that unwraps (flattens) a container block.
	 *
	 * Updated to use the v2 blocks.
	 */
	registerPlugin( 'mrshortcuts-gb-unwrap-container', {
		render: () => {
			const selectedBlock = useSelect( ( select ) => {
				return select( 'core/block-editor' ).getSelectedBlock();
			}, [] );

			// If no block is selected, return.
			if ( null === selectedBlock ) {
				return null;
			}

			// If block is not a container, return.
			if (
				selectedBlock.name !== 'generateblocks/container' &&
				selectedBlock.name !== 'generateblocks/element'
			) {
				return null;
			}

			// If block has no innerBlocks, return.
			if ( selectedBlock.innerBlocks.length === 0 ) {
				return null;
			}

			let unwrapLabel = 'Unwrap Container';
			if ( 'grid' === selectedBlock.attributes?.styles?.display ) {
				unwrapLabel = 'Unwrap Grid';
			}

			// Get the first child block.
			const firstChildBlock = selectedBlock.innerBlocks[ 0 ] || null;

			// If more than one block is selected, add toolbar option to unwrap container.
			return (
				<PluginBlockSettingsMenuItem
					icon={ <UnGroupIcon /> }
					label={ unwrapLabel }
					onClick={ () => {
						const innerBlocks = selectedBlock.innerBlocks;
						wp.data
							.dispatch( 'core/block-editor' )
							.replaceBlocks( selectedBlock.clientId, innerBlocks );

						// Select the first child block in the editor.
						wp.data
							.dispatch( 'core/block-editor' )
							.selectBlock( firstChildBlock.clientId );
					} }
				/>
			);
		},
	} );

	/**
	 * Register a plugin that changes a shape to a link.
	 *
	 * Updated to use the v2 blocks.
	 */
	registerPlugin( 'mrshortcuts-gb-convert-shape-to-link', {
		render: () => {
			const selectedBlock = useSelect( ( select ) => {
				return select( 'core/block-editor' ).getSelectedBlock();
			}, [] );

			// If no block is selected, return.
			if ( null === selectedBlock ) {
				return null;
			}

			// If block is not a shape, return.
			if ( selectedBlock.name !== 'generateblocks/shape' ) {
				return null;
			}

			// If more than one block is selected, add toolbar option to unwrap container.
			return (
				<PluginBlockSettingsMenuItem
					icon={ <LinkIcon /> }
					label="Transform Shape to Link"
					onClick={ () => {
						const newBlock = wp.blocks.createBlock( 'generateblocks/text', {
							icon: selectedBlock.attributes.html,
							iconLocation: 'before',
							iconOnly: true,
							tagName: 'a',
							...selectedBlock.attributes,
						} );
						wp.data
							.dispatch( 'core/block-editor' )
							.replaceBlocks( selectedBlock.clientId, newBlock );
					} }
				/>
			);
		},
	} );

	/**
	 * Save the selected block's SVG into the GenerateBlocks Pro Asset Library.
	 */
	registerPlugin( 'mrshortcuts-gb-save-svg-to-asset-library', {
		render: () => {
			const [ isOpen, setIsOpen ] = useState( false );
			const [ capturedSvg, setCapturedSvg ] = useState( '' );
			const selectedBlock = useSelect( ( selectStore ) => {
				return selectStore( 'core/block-editor' ).getSelectedBlock();
			}, [] );
			const selectedBlockCount = useSelect( ( selectStore ) => {
				return selectStore( 'core/block-editor' ).getSelectedBlockCount();
			}, [] );

			const canManageLibrary =
				typeof mrshortcutsgbPatternInserter !== 'undefined' &&
				'true' === mrshortcutsgbPatternInserter.isProActive &&
				'true' === mrshortcutsgbPatternInserter.canManageAssetLibrary;
			const svgMarkup = extractSvgFromBlock( selectedBlock );
			const showMenuItem =
				canManageLibrary &&
				selectedBlockCount === 1 &&
				selectedBlock !== null &&
				!! svgMarkup;

			return (
				<>
					{ showMenuItem && (
						<PluginBlockSettingsMenuItem
							icon={ <SaveLibraryIcon /> }
							label="Save SVG to Asset Library"
							onClick={ () => {
								setCapturedSvg( svgMarkup );
								setIsOpen( true );
							} }
						/>
					) }
					<SaveSVGToAssetLibraryModal
						isOpen={ isOpen }
						onClose={ () => setIsOpen( false ) }
						mode="from-block"
						initialSvg={ capturedSvg }
					/>
				</>
			);
		},
	} );

	/**
	 * Convert selected block and its descendants from v1 to v2 (contextual).
	 */
	registerPlugin( 'mrshortcuts-gb-convert-to-v2-contextual', {
		render: () => {
			const selectedBlock = useSelect( ( selectStore ) => {
				return selectStore( 'core/block-editor' ).getSelectedBlock();
			}, [] );
			const selectedBlockCount = useSelect( ( selectStore ) => {
				return selectStore( 'core/block-editor' ).getSelectedBlockCount();
			}, [] );
			const dispatch = useDispatch();

			if ( selectedBlockCount !== 1 || selectedBlock === null ) {
				return null;
			}
			if (
				typeof mrshortcutsgbPatternInserter !== 'undefined' &&
				'false' === ( mrshortcutsgbPatternInserter.enableV1Transformations || 'false' )
			) {
				return null;
			}
			if ( ! hasV1BlockInSubtree( selectedBlock ) ) {
				return null;
			}

			return (
				<PluginBlockSettingsMenuItem
					icon={ <ReplaceIcon /> }
					label="Convert v1 Blocks to v2"
					onClick={ () => {
						transformBlockSubtreeFromContext( selectedBlock, select, dispatch );
					} }
				/>
			);
		},
	} );

	/**
	 * Greatest common divisor of two integers.
	 *
	 * @param {number} left  First value.
	 * @param {number} right Second value.
	 * @return {number} Shared divisor.
	 */
	const greatestCommonDivisor = ( left, right ) => {
		let a = Math.abs( left );
		let b = Math.abs( right );
		while ( b ) {
			const remainder = a % b;
			a = b;
			b = remainder;
		}
		return a || 1;
	};

	/**
	 * Read a column width percentage.
	 *
	 * @param {Object} column Column block.
	 * @return {number|null} Percentage, or null when the column has no width.
	 */
	const columnWidthPercent = ( column ) => {
		const width = column?.attributes?.width;
		if ( 'string' !== typeof width || ! width.trim() ) {
			return null;
		}
		const value = parseFloat( width );
		if ( ! Number.isFinite( value ) || value <= 0 ) {
			return null;
		}
		return value;
	};

	/**
	 * Turn column widths into a simplified `fr` track list.
	 *
	 * @param {number[]} widths Column width percentages.
	 * @return {number[]} Track sizes.
	 */
	const columnWidthTracks = ( widths ) => {
		const smallest = Math.min( ...widths );
		const ratios = widths.map( ( width ) => width / smallest );
		const nearest = ratios.map( ( ratio ) => Math.round( ratio ) );
		const closeToWhole = ratios.every( ( ratio, index ) => Math.abs( ratio - nearest[ index ] ) < 0.08 );
		if ( closeToWhole && nearest.every( ( part ) => part >= 1 && part <= 12 ) ) {
			return nearest;
		}

		const percents = widths.map( ( width ) => Math.max( 1, Math.round( width ) ) );
		const divisor = percents.reduce( ( current, value ) => greatestCommonDivisor( current, value ) );
		return percents.map( ( value ) => Math.round( value / divisor ) );
	};

	/**
	 * Build the desktop grid-template-columns value.
	 *
	 * @param {Array} columns Column blocks.
	 * @return {string} CSS grid template.
	 */
	const gridTemplateColumns = ( columns ) => {
		const count = Math.max( columns.length, 1 );
		const equal = `repeat(${ count }, minmax(0, 1fr))`;
		const widths = columns.map( columnWidthPercent );
		if ( ! widths.length || widths.some( ( width ) => null === width ) ) {
			return equal;
		}

		const tracks = columnWidthTracks( widths );
		if ( ! tracks || tracks.every( ( track ) => track === tracks[ 0 ] ) ) {
			return equal;
		}

		return tracks.map( ( track ) => `${ track }fr` ).join( ' ' );
	};

	/**
	 * Column and row gaps for the grid.
	 *
	 * @param {Object} attributes Columns block attributes.
	 * @return {Object} `columnGap` and `rowGap`.
	 */
	const gridGaps = ( attributes ) => {
		const blockGap = attributes?.style?.spacing?.blockGap;
		let columnGap = '1em';
		let rowGap = '1em';

		if ( 'string' === typeof blockGap && blockGap ) {
			columnGap = blockGap;
			rowGap = blockGap;
		} else if ( blockGap && 'object' === typeof blockGap ) {
			if ( blockGap.left ) {
				columnGap = blockGap.left;
			}
			if ( blockGap.top ) {
				rowGap = blockGap.top;
			}
		}

		return { columnGap, rowGap };
	};

	/**
	 * Small-screen media query used by the GenerateBlocks Grid variation.
	 *
	 * @return {string} At-rule.
	 */
	const smallWidthQuery = () => {
		const rules = window.generateBlocksDefaultAtRules;
		if ( Array.isArray( rules ) ) {
			const match = rules.find( ( rule ) => 'smallWidth' === rule?.id && 'string' === typeof rule.value && rule.value );
			if ( match ) {
				return match.value;
			}
		}
		return '@media (max-width:767px)';
	};

	/**
	 * Allow transform from group block.
	 *
	 * Updated for v2 blocks.
	 */
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'generateblocks/transform/group',
		( blockSettings ) => {
			if ( blockSettings.name === 'core/group' ) {
				const transformsTo = blockSettings.transforms?.to || [];
				transformsTo.push( {
					type: 'block',
					blocks: [ 'generateblocks/element' ],
					transform: ( attributes, innerBlocks ) => {
						return wp.blocks.createBlock(
							'generateblocks/element',
							{},
							innerBlocks
						);
					},
				} );
				blockSettings.transforms.to = transformsTo;
			}
			return blockSettings;
		}
	);

	/**
	 * Allow transform from a Columns block to a GenerateBlocks grid.
	 */
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'generateblocks/transform/columns',
		( blockSettings ) => {
			if ( blockSettings.name === 'core/columns' ) {
				const transformsTo = blockSettings.transforms?.to || [];
				transformsTo.push( {
					type: 'block',
					blocks: [ 'generateblocks/element' ],
					transform: ( attributes, innerBlocks ) => {
						const columns = ( innerBlocks || [] ).filter( ( block ) => 'core/column' === block?.name );
						const styles = {
							display: 'grid',
							gridTemplateColumns: gridTemplateColumns( columns ),
							...gridGaps( attributes ),
						};

						if ( false !== attributes?.isStackedOnMobile ) {
							styles[ smallWidthQuery() ] = {
								gridTemplateColumns: '1fr',
							};
						}

						const cells = columns.map( ( column ) => wp.blocks.createBlock(
							'generateblocks/element',
							{ tagName: 'div' },
							column.innerBlocks || []
						) );

						return wp.blocks.createBlock(
							'generateblocks/element',
							{
								tagName: 'div',
								styles,
							},
							cells
						);
					},
				} );
				blockSettings.transforms.to = transformsTo;
			}
			return blockSettings;
		}
	);

	/**
	 * Allow transform from the Shape to Text block.
	 *
	 * Updated for v2 blocks.
	 */
	wp.hooks.addFilter(
		'blocks.registerBlockType',
		'generateblocks/transform/shape',
		( blockSettings ) => {
			if ( blockSettings.name === 'generateblocks/shape' ) {
				const transformsTo = blockSettings.transforms?.to || [];
				transformsTo.push( {
					type: 'block',
					blocks: [ 'generateblocks/text' ],
					transform: ( attributes, innerBlocks ) => {
						const newAttributes = {
							...attributes,
							icon: attributes.html,
							iconLocation: 'before',
							tagName: 'div',
						};
						return wp.blocks.createBlock(
							'generateblocks/text',
							newAttributes,
							innerBlocks
						);
					},
				} );
				if ( ! blockSettings.hasOwnProperty( 'transforms' ) ) {
					blockSettings.transforms = {};
				}
				if ( ! blockSettings.transforms.hasOwnProperty( 'to' ) ) {
					blockSettings.transforms.to = [];
				}
				blockSettings.transforms.to = transformsTo;
			}
			return blockSettings;
		}
	);

	/**
	 * Allow markdown to transform to the headline (text) block.
	 *
	 * Updated for v2 blocks.
	 */
	if ( mrshortcutsgbPatternInserter.enableMarkdownToHeadlineBlock ) {
		wp.hooks.addFilter(
			'blocks.registerBlockType',
			'generateblocks/transform/markdown',
			( blockSettings ) => {
				if (
					blockSettings.name === 'core/paragraph' ||
					blockSettings.name === 'generateblocks/text'
				) {
					const transformFrom = blockSettings.transforms?.from || [];
					transformFrom.push( {
						type: 'prefix',
						prefix: '#',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h1',
							} );
						},
						priority: 1,
					} );
					transformFrom.push( {
						type: 'prefix',
						prefix: '##',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h2',
							} );
						},
						priority: 1,
					} );
					transformFrom.push( {
						type: 'prefix',
						prefix: '###',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h3',
							} );
						},
						priority: 1,
					} );
					transformFrom.push( {
						type: 'prefix',
						prefix: '####',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h4',
							} );
						},
						priority: 1,
					} );
					transformFrom.push( {
						type: 'prefix',
						prefix: '#####',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h5',
							} );
						},
						priority: 1,
					} );
					transformFrom.push( {
						type: 'prefix',
						prefix: '######',
						transform: ( content ) => {
							return wp.blocks.createBlock( 'generateblocks/text', {
								content,
								tagName: 'h6',
							} );
						},
						priority: 1,
					} );

					blockSettings.transforms.from = transformFrom;
				}
				return blockSettings;
			}
		);
	}
}( window.wp ) );
