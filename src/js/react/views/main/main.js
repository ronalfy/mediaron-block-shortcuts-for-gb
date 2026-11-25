// eslint-disable-next-line no-unused-vars
import React, { Suspense, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
	ToggleControl,
	CheckboxControl,
	TextControl,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { PanelColorSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import { useAsyncResource } from 'use-async-resource';
import { AlertCircle, Info } from 'lucide-react';

// Local imports.
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import SaveResetButtons from '../../components/SaveResetButtons';

const DOCS_URL = 'https://docs.mediaron.com/product/block-shortcuts-for-gb/';

const DEFAULT_BLOCK_LIST_COLORS = {
	background: '',
	icon: '',
	text: '',
};

/**
 * Keep a hex color, or clear the field.
 *
 * The color panel calls onChange with undefined when a color is cleared.
 * Palette values that are not hex are ignored so a saved color stays put.
 *
 * @param {string|undefined} value Color from PanelColorSettings.
 * @return {string|null} Hex color, an empty string when cleared, or null to ignore.
 */
function normalizeBlockListColor( value ) {
	if ( ! value ) {
		return '';
	}
	const next = String( value ).trim();
	if ( /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test( next ) ) {
		return next;
	}
	return null;
}

/**
 * Documentation anchor shared by the header and the in-page fallback.
 */
const DocsAnchor = () => {
	return (
		<a
			className="mrshortcuts-gb-docs-link"
			href={ DOCS_URL }
			target="_blank"
			rel="noopener noreferrer"
		>
			{ __( 'Documentation', 'mediaron-block-shortcuts-for-gb' ) }
		</a>
	);
};

/**
 * Place the docs link in the GenerateBlocks dashboard header.
 *
 * The header action slot is absent while GenerateBlocks Pro is active, so this
 * creates it. Without that header, the link sits above the settings panels.
 */
const DocsLink = () => {
	const [ slot, setSlot ] = useState( null );
	const [ useFallback, setUseFallback ] = useState( false );

	useEffect( () => {
		const header = document.querySelector( '.gblocks-dashboard-header' );
		if ( ! header ) {
			setUseFallback( true );
			return undefined;
		}

		let actions = header.querySelector( '.gblocks-dashboard-header-actions' );
		let created = false;
		if ( ! actions ) {
			actions = document.createElement( 'div' );
			actions.className = 'gblocks-dashboard-header-actions';
			header.appendChild( actions );
			created = true;
		}
		setSlot( actions );

		return () => {
			if ( created && actions.parentNode ) {
				actions.parentNode.removeChild( actions );
			}
		};
	}, [] );

	if ( useFallback ) {
		return (
			<div className="mrshortcuts-gb-docs-fallback">
				<DocsAnchor />
			</div>
		);
	}

	if ( ! slot ) {
		return null;
	}

	return createPortal( <DocsAnchor />, slot );
};

const retrieveOptions = () => {
	return SendCommand( 'mrshortcutsgb_get_options', {
		nonce: mrshortcutsgbAdmin.getNonce,
	} );
};

const Main = ( props ) => {
	const [ defaults ] = useAsyncResource( retrieveOptions, [] );
	return (
		<Suspense
			fallback={
				<>
					<h2>{ __( 'Loading…', 'mediaron-block-shortcuts-for-gb' ) }</h2>
				</>
			}
		>
			<Interface defaults={ defaults } { ...props } />
		</Suspense>
	);
};

const Interface = ( props ) => {
	const { defaults } = props;
	const response = defaults();
	const { data } = response.data;

	const {
		control,
		handleSubmit,
		getValues,
		reset,
		setError,
		trigger,
		setValue,
	} = useForm( {
		defaultValues: {
			enableAdobeFonts: data.enableAdobeFonts,
			saveNonce: mrshortcutsgbAdmin.saveNonce,
			resetNonce: mrshortcutsgbAdmin.resetNonce,
			enabledPostTypes: data.enabledPostTypes,
			allowedGoogleFonts: data.allowedGoogleFonts,
			enableMarkdownToHeadlineBlock: data.enableMarkdownToHeadlineBlock,
			disablePatternLibrary: data.disablePatternLibrary || false,
			disablePatternInserter: data.disablePatternInserter || false,
			enableV1Transformations: data.enableV1Transformations,
			enableV1Blocks: data.enableV1Blocks,
			v1CategoryLabel: data.v1CategoryLabel,
			v2CategoryLabel: data.v2CategoryLabel,
			v1BlockSuffix: data.v1BlockSuffix,
			v2BlockSuffix: data.v2BlockSuffix,
			identifyGenerateBlocks: data.identifyGenerateBlocks || false,
			generateBlocksSuffix: data.generateBlocksSuffix ?? '(GB)',
			blockListColors: {
				background: data.blockListColors?.background ?? DEFAULT_BLOCK_LIST_COLORS.background,
				icon: data.blockListColors?.icon ?? DEFAULT_BLOCK_LIST_COLORS.icon,
				text: data.blockListColors?.text ?? DEFAULT_BLOCK_LIST_COLORS.text,
			},
			adminMenuBar: data.adminMenuBar || {
				enabled: true,
				replaceWithFullMenu: false,
			},
		},
	} );
	const formValues = useWatch( { control } );
	const { errors, isDirty, dirtyFields } = useFormState( {
		control,
	} );
	const blockListColors = formValues.blockListColors || DEFAULT_BLOCK_LIST_COLORS;
	const setBlockListColor = ( key ) => ( value ) => {
		const next = normalizeBlockListColor( value );
		if ( null === next ) {
			return;
		}
		setValue( `blockListColors.${ key }`, next, { shouldDirty: true } );
	};

	return (
		<>
			{ /* eslint-disable-next-line no-unused-vars */ }
			<form onSubmit={ handleSubmit( ( formData ) => {} ) }>
				<DocsLink />
				<div id="mrshortcuts-gb-admin-table">
					<PanelBody
						title={ __( 'Block Settings', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<Controller
									name="enableMarkdownToHeadlineBlock"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __( 'Enable Markdown to Text Block', 'mediaron-block-shortcuts-for-gb' ) }
											checked={ getValues( 'enableMarkdownToHeadlineBlock' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'By default, the markdown syntax for headings creates Core heading blocks. By enabling this, the markdown will now be converted to the Text block.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
								/>
								{ getValues( 'enableDefaultHeadlineBlock' ) &&
									getValues( 'enableMarkdownToHeadlineBlock' ) && (
									<Notice
										message={ __(
											'Markdown syntax is unavailable if the default block is set to the headline block.',
											'mediaron-block-shortcuts-for-gb'
										) }
										status="warning"
										politeness="assertive"
										inline={ true }
										icon={ () => (
											<AlertCircle
												size={ 16 }
												style={ { color: 'currentColor' } }
											/>
										) }
									/>
								) }
							</div>
							<div className="dlx-admin__row">
								<Controller
									name="disablePatternLibrary"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __( 'Disable GenerateBlocks Pattern Library', 'mediaron-block-shortcuts-for-gb' ) }
											checked={ getValues( 'disablePatternLibrary' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'Hides the Pattern Library button in the block editor header and the Pattern Library item in the editor options menu.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
								/>
							</div>
							<div className="dlx-admin__row">
								<Controller
									name="disablePatternInserter"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __( 'Disable Pattern Inserter', 'mediaron-block-shortcuts-for-gb' ) }
											checked={ getValues( 'disablePatternInserter' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'Hides the Pattern Inserter block and the GenerateBlocks: Import Pattern command.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
								/>
							</div>
						</div>
					</PanelBody>
					<PanelBody
						title={ __( 'Block Identification Helpers', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<Controller
									name="identifyGenerateBlocks"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __(
												'Identify GenerateBlocks Blocks',
												'mediaron-block-shortcuts-for-gb'
											) }
											checked={ getValues( 'identifyGenerateBlocks' ) }
											help={ __(
												'Add a suffix to GenerateBlocks block titles in the inserter, slash commands, List View, and block navigation. This works while 1.x blocks are hidden.',
												'mediaron-block-shortcuts-for-gb'
											) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
										/>
									) }
								/>
							</div>
							{ getValues( 'identifyGenerateBlocks' ) && (
								<div className="dlx-admin__row">
									<Controller
										name="generateBlocksSuffix"
										control={ control }
										render={ ( { field: { onChange } } ) => (
											<TextControl
												label={ __(
													'GenerateBlocks Suffix',
													'mediaron-block-shortcuts-for-gb'
												) }
												value={ getValues( 'generateBlocksSuffix' ) }
												onChange={ ( textValue ) => {
													onChange( textValue );
												} }
												help={ __(
													'Added to the end of each GenerateBlocks block title. A space is inserted automatically. The default is (GB). Leave blank to add no suffix.',
													'mediaron-block-shortcuts-for-gb'
												) }
											/>
										) }
									/>
								</div>
							) }
							<div className="dlx-admin__row">
								<Controller
									name="enableV1Transformations"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __(
												'Enable v1 to v2 conversion',
												'mediaron-block-shortcuts-for-gb'
											) }
											help={ __(
												'Shows the experimental conversion in the command palette and in the block options menu when a selected block contains 1.x blocks.',
												'mediaron-block-shortcuts-for-gb'
											) }
											checked={ getValues( 'enableV1Transformations' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
										/>
									) }
								/>
							</div>
							<div className="dlx-admin__row">
								<Notice
									message={ __(
										'This command is experimental. It is only needed when both version 1 and version 2 blocks are present.',
										'mediaron-block-shortcuts-for-gb'
									) }
									status="warning"
									politeness="assertive"
									inline={ true }
									icon={ () => <AlertCircle strokeWidth={ 2.5 } /> }
								/>
							</div>
							<div className="dlx-admin__row">
								<Controller
									name="enableV1Blocks"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __(
												'Enable v1 and v2 Blocks (Both Visible)',
												'mediaron-block-shortcuts-for-gb'
											) }
											checked={ getValues( 'enableV1Blocks' ) }
											help={ __(
												'Enable the use of v1 blocks in the block editor. This can help with the migration from GenerateBlocks 1.x to 2.x.',
												'mediaron-block-shortcuts-for-gb'
											) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
										/>
									) }
								/>
							</div>
							{ 'undefined' !== typeof mrshortcutsgbAdmin.gbUseV1Blocks && (
								<div className="dlx-admin__row">
									<Notice
										message={
											'true' === mrshortcutsgbAdmin.gbUseV1Blocks
												? __(
													'GenerateBlocks already has version 1 blocks enabled. Its inserter shows only version 1 blocks. Enable both v1 and v2 blocks with the toggle above.',
													'mediaron-block-shortcuts-for-gb'
												)
												: __(
													'GenerateBlocks has hidden v1 blocks because there are none present. Enabling this toggle shows both versions, which is typically used to help with the migration from GenerateBlocks 1.x to 2.x.',
													'mediaron-block-shortcuts-for-gb'
												)
										}
										status={ 'true' === mrshortcutsgbAdmin.gbUseV1Blocks ? 'info' : 'warning' }
										politeness={ 'true' === mrshortcutsgbAdmin.gbUseV1Blocks ? 'polite' : 'assertive' }
										inline={ true }
										icon={ () => (
											'true' === mrshortcutsgbAdmin.gbUseV1Blocks ? (
												<Info strokeWidth={ 2.5 } />
											) : (
												<AlertCircle strokeWidth={ 2.5 } />
											)
										) }
									/>
								</div>
							) }
							<div className="dlx-admin__row">
								<p className="description">
									<strong>
										{ __( 'Version labels', 'mediaron-block-shortcuts-for-gb' ) }
									</strong>
									<br />
									{ __(
										'Version suffixes are added when Enable v1 and v2 Blocks (Both Visible) is on, after the GenerateBlocks suffix, for example Container (GB) (v1). Saved category titles stay in place when that option is off.',
										'mediaron-block-shortcuts-for-gb'
									) }
								</p>
							</div>
							{ getValues( 'enableV1Blocks' ) && (
								<>
									<div className="dlx-admin__row">
										<Controller
											name="v1CategoryLabel"
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<TextControl
													label={ __( 'v1 Category Label', 'mediaron-block-shortcuts-for-gb' ) }
													value={ getValues( 'v1CategoryLabel' ) }
													onChange={ ( textValue ) => {
														onChange( textValue );
													} }
													help={ __(
														'This label will be the category label for v1 blocks. These will be displayed towards the end of the category list.',
														'mediaron-block-shortcuts-for-gb'
													) }
												/>
											) }
										/>
									</div>
									<div className="dlx-admin__row">
										<Controller
											name="v2CategoryLabel"
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<TextControl
													label={ __( 'v2 Category Label', 'mediaron-block-shortcuts-for-gb' ) }
													value={ getValues( 'v2CategoryLabel' ) }
													onChange={ ( textValue ) => {
														onChange( textValue );
													} }
													help={ __(
														'This label will be the category label for v2 blocks. These will be displayed towards the beginning of the category list.',
														'mediaron-block-shortcuts-for-gb'
													) }
												/>
											) }
										/>
									</div>
									<div className="dlx-admin__row">
										<Controller
											name="v1BlockSuffix"
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<TextControl
													label={ __( 'v1 Block Suffix', 'mediaron-block-shortcuts-for-gb' ) }
													value={ getValues( 'v1BlockSuffix' ) }
													onChange={ ( textValue ) => {
														onChange( textValue );
													} }
													help={ __(
														'Added after the 1.x block title, and after the GenerateBlocks suffix when that is also on. Leave blank to add no suffix.',
														'mediaron-block-shortcuts-for-gb'
													) }
												/>
											) }
										/>
									</div>
									<div className="dlx-admin__row">
										<Controller
											name="v2BlockSuffix"
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<TextControl
													label={ __( 'v2 Block Suffix', 'mediaron-block-shortcuts-for-gb' ) }
													value={ getValues( 'v2BlockSuffix' ) }
													onChange={ ( textValue ) => {
														onChange( textValue );
													} }
													help={ __(
														'Added after the 2.x block title, and after the GenerateBlocks suffix when that is also on. Leave blank to add no suffix.',
														'mediaron-block-shortcuts-for-gb'
													) }
												/>
											) }
										/>
									</div>
								</>
							) }
							<div className="dlx-admin__row">
								<p className="description">
									{ __(
										'Colors apply to GenerateBlocks and GenerateBlocks Pro blocks in the inserter. Slash commands use the icon color only. Save, then open the editor again.',
										'mediaron-block-shortcuts-for-gb'
									) }
								</p>
								<PanelColorSettings
									__experimentalIsRenderedInSidebar
									className="mrshortcuts-gb-block-colors"
									title={ __( 'Block colors', 'mediaron-block-shortcuts-for-gb' ) }
									enableAlpha={ false }
									disableCustomColors={ false }
									colors={ mrshortcutsgbAdmin.colorPalette || [] }
									colorSettings={ [
										{
											label: __( 'Background color', 'mediaron-block-shortcuts-for-gb' ),
											value: blockListColors.background || undefined,
											onChange: setBlockListColor( 'background' ),
											clearable: true,
										},
										{
											label: __( 'Icon color', 'mediaron-block-shortcuts-for-gb' ),
											value: blockListColors.icon || undefined,
											onChange: setBlockListColor( 'icon' ),
											clearable: true,
										},
										{
											label: __( 'Text color', 'mediaron-block-shortcuts-for-gb' ),
											value: blockListColors.text || undefined,
											onChange: setBlockListColor( 'text' ),
											clearable: true,
										},
									] }
								/>
							</div>
						</div>
					</PanelBody>
					<PanelBody
						title={ __( 'Post Type Styles', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<p className="description">
									{ __(
										'Select the post types that you would like to enable GenerateBlocks styles for.',
										'mediaron-block-shortcuts-for-gb'
									) }
								</p>
							</div>
							<div className="dlx-admin__row">
								{ Object.values( mrshortcutsgbAdmin.postTypes ).map( ( postType ) => {
									const postTypeSlug = postType.name;
									return (
										<Controller
											key={ postTypeSlug }
											name={ `enabledPostTypes[${ postTypeSlug }]` }
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<CheckboxControl
													label={ postType.label }
													className="dlx-admin__checkbox-control"
													checked={
														getValues( `enabledPostTypes[${ postTypeSlug }]` ) ??
														false
													}
													onChange={ ( boolValue ) => {
														setValue(
															`enabledPostTypes[${ postTypeSlug }]`,
															boolValue
														);
														onChange( boolValue );
													} }
												/>
											) }
										/>
									);
								} ) }
							</div>
						</div>
					</PanelBody>
					<PanelBody
						title={ __( 'Admin Menu Bar', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<Controller
									name="adminMenuBar.enabled"
									control={ control }
									render={ ( { field: { onChange, value } } ) => (
										<ToggleControl
											label={ __(
												'Enable GenerateBlocks Admin Bar Menu',
												'mediaron-block-shortcuts-for-gb'
											) }
											checked={ value ?? true }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
												// If disabling the main menu, also disable replace with full menu.
												if ( ! boolValue ) {
													setValue( 'adminMenuBar.replaceWithFullMenu', false );
												}
											} }
											help={ __(
												'Administrators and Editors only: when disabled, all GenerateBlocks admin bar menu items are hidden from the top toolbar for those roles. Other roles keep the default menu.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
								/>
							</div>
							{ getValues( 'adminMenuBar.enabled' ) && (
								<div className="dlx-admin__row">
									<Controller
										name="adminMenuBar.replaceWithFullMenu"
										control={ control }
										render={ ( { field: { onChange, value } } ) => (
											<ToggleControl
												label={ __(
													'Replace Overlay Panels with Full GenerateBlocks Menu',
													'mediaron-block-shortcuts-for-gb'
												) }
												checked={ value ?? false }
												onChange={ onChange }
												help={ __(
													'Administrators and Editors only: when enabled, replaces the Overlay Panels menu with a full GenerateBlocks menu containing Settings, Local Patterns, Global Styles, Overlay Panels, Conditions, Asset Library, and Shortcuts.',
													'mediaron-block-shortcuts-for-gb'
												) }
											/>
										) }
									/>
								</div>
							) }
						</div>
					</PanelBody>
					<PanelBody title={ __( 'Miscellaneous', 'mediaron-block-shortcuts-for-gb' ) } initialOpen={ true }>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<Controller
									name="enableAdobeFonts"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __(
												'Enable Adobe Fonts in the Block Editor',
												'mediaron-block-shortcuts-for-gb'
											) }
											checked={ getValues( 'enableAdobeFonts' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'If you are using the Custom Adobe Fonts plugin or the Blocksy Adobe Fonts module, you can display these in the block editor.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
								/>
							</div>
						</div>
					</PanelBody>
					<SaveResetButtons
						formValues={ formValues }
						setError={ setError }
						reset={ reset }
						errors={ errors }
						isDirty={ isDirty }
						dirtyFields={ dirtyFields }
						trigger={ trigger }
					/>
				</div>
			</form>
		</>
	);
};

export default Main;
