// eslint-disable-next-line no-unused-vars
import React, { Suspense } from 'react';
import {
	ToggleControl,
	CheckboxControl,
	TextControl,
	PanelBody,
	PanelRow,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useForm, Controller, useWatch, useFormState } from 'react-hook-form';
import { useAsyncResource } from 'use-async-resource';
import { AlertCircle } from 'lucide-react';

// Local imports.
import SendCommand from '../../utils/SendCommand';
import Notice from '../../components/Notice';
import SaveResetButtons from '../../components/SaveResetButtons';

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
			autoRegenerateStylesPostTypes: data.autoRegenerateStylesPostTypes || {},
			allowedGoogleFonts: data.allowedGoogleFonts,
			enableMarkdownToHeadlineBlock: data.enableMarkdownToHeadlineBlock,
			enablePastePatternProcessing: data.enablePastePatternProcessing || false,
			enableV1Transformations: data.enableV1Transformations,
			enableV1Blocks: data.enableV1Blocks,
			v1CategoryLabel: data.v1CategoryLabel,
			v2CategoryLabel: data.v2CategoryLabel,
			v1BlockSuffix: data.v1BlockSuffix,
			v2BlockSuffix: data.v2BlockSuffix,
			adminMenuBar: data.adminMenuBar || {
				enabled: true,
				replaceWithFullMenu: false,
			},
			enableFrontendCommandPalette: data.enableFrontendCommandPalette || false,
		},
	} );
	const formValues = useWatch( { control } );
	const { errors, isDirty, dirtyFields } = useFormState( {
		control,
	} );

	return (
		<>
			{ /* eslint-disable-next-line no-unused-vars */ }
			<form onSubmit={ handleSubmit( ( formData ) => {} ) }>
				<div id="mrshortcuts-gb-admin-table">
					<PanelBody
						title={ __( 'Block Settings', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<Controller
									name="enableV1Transformations"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __(
												'Enable v1 Transformations Block Command',
												'mediaron-block-shortcuts-for-gb'
											) }
											help={ __(
												'Enable a command in the block editor to transform GenerateBlocks 1.x blocks to 2.x blocks.',
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
							<div className="dlx-admin__row">
								<Controller
									name="enableFrontendCommandPalette"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __( 'Enable Frontend Command Palette', 'mediaron-block-shortcuts-for-gb' ) }
											checked={ getValues( 'enableFrontendCommandPalette' ) }
											help={ __(
												'Enable the WordPress command palette (Ctrl/Cmd+K) on the frontend for logged-in administrators. Note: This requires WordPress 6.9+ and may have limitations. Search for GenerateBlocks for shortcuts.',
												'mediaron-block-shortcuts-for-gb'
											) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
										/>
									) }
								/>
							</div>
							{ getValues( 'enableV1Blocks' ) && (
								<>
									<div className="dlx-admin__row">
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
									</div>
									<div className="dlx-admin__row">
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
														'This suffix will be added to the end of the block name for v1 blocks. Leave blank to not add a suffix.',
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
														'This suffix will be added to the end of the block name for v2 blocks. Leave blank to not add a suffix.',
														'mediaron-block-shortcuts-for-gb'
													) }
												/>
											) }
										/>
									</div>
								</>
							) }
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
									name="enablePastePatternProcessing"
									control={ control }
									render={ ( { field: { onChange } } ) => (
										<ToggleControl
											label={ __( 'Process pasted patterns', 'mediaron-block-shortcuts-for-gb' ) }
											checked={ getValues( 'enablePastePatternProcessing' ) }
											onChange={ ( boolValue ) => {
												onChange( boolValue );
											} }
											help={ __(
												'When pasting WordPress block markup in the editor, download remote images into the Media Library and give GenerateBlocks blocks new unique IDs before the blocks are inserted.',
												'mediaron-block-shortcuts-for-gb'
											) }
										/>
									) }
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
						title={ __( 'Auto-Regenerate Styles on Save', 'mediaron-block-shortcuts-for-gb' ) }
						initialOpen={ true }
					>
						<div className="gblocks-dashboard-panel-row-wrapper">
							<div className="dlx-admin__row">
								<p className="description">
									{ __(
										'Select post types that should clear GenerateBlocks CSS caches when saved, so styles regenerate on the next page load. Useful for template parts and other shared content.',
										'mediaron-block-shortcuts-for-gb'
									) }
								</p>
							</div>
							<div className="dlx-admin__row">
								{ Object.values( mrshortcutsgbAdmin.postTypes ).map( ( postType ) => {
									const postTypeSlug = postType.name;
									return (
										<Controller
											key={ `auto-regen-${ postTypeSlug }` }
											name={ `autoRegenerateStylesPostTypes[${ postTypeSlug }]` }
											control={ control }
											render={ ( { field: { onChange } } ) => (
												<CheckboxControl
													label={ postType.label }
													className="dlx-admin__checkbox-control"
													checked={
														getValues(
															`autoRegenerateStylesPostTypes[${ postTypeSlug }]`
														) ?? false
													}
													onChange={ ( boolValue ) => {
														setValue(
															`autoRegenerateStylesPostTypes[${ postTypeSlug }]`,
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
