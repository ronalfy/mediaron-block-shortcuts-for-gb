/**
 * Modal for saving an SVG into the GenerateBlocks Pro Asset Library.
 */

import { useEffect, useState } from 'react';
import {
	Button,
	Modal,
	Notice,
	SelectControl,
	Spinner,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import {
	forceGenerateBlocksIconPickerRefresh,
	patchGenerateBlocksProIcons,
} from '../../../utils/svgAssetLibrary';
import sanitizeSVG from '../../../utils/sanitize-svg';

const NEW_GROUP_VALUE = '__mrshortcuts_new_group__';

/**
 * SaveSVGToAssetLibraryModal component.
 *
 * @param {Object}   props            Component props.
 * @param {boolean}  props.isOpen     Whether the modal is visible.
 * @param {Function} props.onClose    Close callback.
 * @param {string}   props.mode       `paste` or `from-block`.
 * @param {string}   props.initialSvg Prefill SVG for from-block mode.
 * @return {JSX.Element|null} Modal, or null when closed.
 */
const SaveSVGToAssetLibraryModal = ( { isOpen, onClose, mode = 'paste', initialSvg = '' } ) => {
	const [ name, setName ] = useState( '' );
	const [ selectedGroup, setSelectedGroup ] = useState( '' );
	const [ customGroup, setCustomGroup ] = useState( '' );
	const [ groups, setGroups ] = useState( [] );
	const [ svg, setSvg ] = useState( '' );
	const [ capturedSvg, setCapturedSvg ] = useState( '' );
	const [ isLoadingGroups, setIsLoadingGroups ] = useState( false );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ error, setError ] = useState( '' );
	const [ success, setSuccess ] = useState( '' );
	const [ status, setStatus ] = useState( 'idle' );
	const [ savedName, setSavedName ] = useState( '' );
	const [ savedGroup, setSavedGroup ] = useState( '' );

	const isFromBlock = 'from-block' === mode;
	const isAddingGroup = NEW_GROUP_VALUE === selectedGroup;
	const resolvedGroup = isAddingGroup ? customGroup : selectedGroup;
	const resolvedSvg = isFromBlock ? capturedSvg : svg;
	const sanitizedPreview = resolvedSvg ? sanitizeSVG( resolvedSvg ) : '';
	const isResult = 'success' === status || 'exists' === status;
	const canSave = ! isSaving && ! isResult && name.trim() && resolvedGroup.trim() && resolvedSvg.trim();

	useEffect( () => {
		if ( ! isOpen ) {
			return;
		}

		const openingSvg = isFromBlock ? initialSvg : '';

		setName( '' );
		setSelectedGroup( '' );
		setCustomGroup( '' );
		setSvg( openingSvg );
		setCapturedSvg( openingSvg );
		setError( '' );
		setSuccess( '' );
		setStatus( 'idle' );
		setSavedName( '' );
		setSavedGroup( '' );
		setIsSaving( false );
		setIsLoadingGroups( true );

		apiFetch( {
			path: '/mediaron/block-shortcuts-for-gb/v1/asset_icon_groups',
		} )
			.then( ( result ) => {
				const loadedGroups = Array.isArray( result.groups ) ? result.groups : [];
				setGroups( loadedGroups );
				setSelectedGroup( loadedGroups.length ? loadedGroups[ 0 ] : NEW_GROUP_VALUE );
			} )
			.catch( ( err ) => {
				setError( err.message || __( 'Could not load Asset Library groups.', 'mediaron-block-shortcuts-for-gb' ) );
				setStatus( 'error' );
				setSelectedGroup( NEW_GROUP_VALUE );
			} )
			.finally( () => {
				setIsLoadingGroups( false );
			} );
		// Reset form state only when the modal opens so a later picker refresh cannot wipe the result.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isOpen ] );

	if ( ! isOpen ) {
		return null;
	}

	const handleClose = () => {
		if ( isSaving ) {
			return;
		}

		if ( isResult ) {
			forceGenerateBlocksIconPickerRefresh();
		}

		onClose();
	};

	const groupOptions = [
		...groups.map( ( groupName ) => ( {
			label: groupName,
			value: groupName,
		} ) ),
		{
			label: __( 'Add new group', 'mediaron-block-shortcuts-for-gb' ),
			value: NEW_GROUP_VALUE,
		},
	];

	const handleSave = () => {
		if ( ! canSave ) {
			return;
		}

		const nameToSave = name.trim();
		const groupToSave = resolvedGroup.trim();

		setIsSaving( true );
		setStatus( 'saving' );
		setError( '' );
		setSuccess( '' );

		apiFetch( {
			path: '/mediaron/block-shortcuts-for-gb/v1/save_asset_icon',
			method: 'POST',
			data: {
				name: nameToSave,
				group: groupToSave,
				svg: resolvedSvg,
			},
		} )
			.then( ( result ) => {
				patchGenerateBlocksProIcons( result, { refresh: false } );
				setSavedName( result.name || nameToSave );
				setSavedGroup( result.group || groupToSave );
				setStatus( result.alreadyExists ? 'exists' : 'success' );
				setSuccess(
					result.alreadyExists
						? __( 'This SVG is already in that group, so it was not added again.', 'mediaron-block-shortcuts-for-gb' )
						: __( 'Saved to the Asset Library. It will appear in the icon picker when you close this dialog.', 'mediaron-block-shortcuts-for-gb' )
				);
			} )
			.catch( ( err ) => {
				setStatus( 'error' );
				setError( err.message || __( 'Could not save the SVG to the Asset Library.', 'mediaron-block-shortcuts-for-gb' ) );
			} )
			.finally( () => {
				setIsSaving( false );
			} );
	};

	return (
		<Modal
			isDismissible={ ! isSaving }
			shouldCloseOnClickOutside={ ! isSaving }
			shouldCloseOnEsc={ ! isSaving }
			title={ __( 'Save SVG to Asset Library', 'mediaron-block-shortcuts-for-gb' ) }
			onRequestClose={ handleClose }
		>
			{ 'saving' === status && (
				<div style={ { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' } }>
					<Spinner />
					<p>{ __( 'Saving to the Asset Library…', 'mediaron-block-shortcuts-for-gb' ) }</p>
				</div>
			) }
			{ error && (
				<Notice
					status="error"
					isDismissible={ false }
				>
					{ error }
				</Notice>
			) }
			{ success && (
				<Notice
					status={ 'exists' === status ? 'warning' : 'success' }
					isDismissible={ false }
				>
					{ success }
				</Notice>
			) }
			{ isResult && (
				<>
					<p>
						<strong>{ __( 'Icon name', 'mediaron-block-shortcuts-for-gb' ) }: </strong>
						{ savedName }
					</p>
					<p>
						<strong>{ __( 'Group', 'mediaron-block-shortcuts-for-gb' ) }: </strong>
						{ savedGroup }
					</p>
					{ sanitizedPreview && (
						<div style={ { marginBottom: '16px' } }>
							<p>
								<strong>{ __( 'Preview', 'mediaron-block-shortcuts-for-gb' ) }</strong>
							</p>
							<div
								style={ {
									width: '48px',
									height: '48px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								} }
								dangerouslySetInnerHTML={ { __html: sanitizedPreview } }
							/>
						</div>
					) }
					<div style={ { display: 'flex', justifyContent: 'flex-end' } }>
						<Button
							variant="primary"
							onClick={ handleClose }
						>
							{ __( 'Done', 'mediaron-block-shortcuts-for-gb' ) }
						</Button>
					</div>
				</>
			) }
			{ ! isResult && (
				<>
					{ isLoadingGroups && (
						<div style={ { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' } }>
							<Spinner />
							<p>{ __( 'Loading groups…', 'mediaron-block-shortcuts-for-gb' ) }</p>
						</div>
					) }
					<TextControl
						label={ __( 'Icon name', 'mediaron-block-shortcuts-for-gb' ) }
						value={ name }
						onChange={ setName }
						disabled={ isSaving }
					/>
					<SelectControl
						label={ __( 'Group', 'mediaron-block-shortcuts-for-gb' ) }
						value={ selectedGroup }
						options={ groupOptions }
						onChange={ setSelectedGroup }
						disabled={ isSaving || isLoadingGroups }
					/>
					{ isAddingGroup && (
						<TextControl
							label={ __( 'New group name', 'mediaron-block-shortcuts-for-gb' ) }
							value={ customGroup }
							onChange={ setCustomGroup }
							disabled={ isSaving }
						/>
					) }
					{ ! isFromBlock && (
						<TextareaControl
							label={ __( 'SVG markup', 'mediaron-block-shortcuts-for-gb' ) }
							value={ svg }
							onChange={ setSvg }
							rows={ 8 }
							disabled={ isSaving }
						/>
					) }
					{ sanitizedPreview && (
						<div style={ { marginBottom: '16px' } }>
							<p>
								<strong>{ __( 'Preview', 'mediaron-block-shortcuts-for-gb' ) }</strong>
							</p>
							<div
								style={ {
									width: '48px',
									height: '48px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								} }
								dangerouslySetInnerHTML={ { __html: sanitizedPreview } }
							/>
						</div>
					) }
					<div style={ { display: 'flex', justifyContent: 'flex-end', gap: '8px' } }>
						<Button
							variant="tertiary"
							onClick={ handleClose }
							disabled={ isSaving }
						>
							{ __( 'Cancel', 'mediaron-block-shortcuts-for-gb' ) }
						</Button>
						<Button
							variant="primary"
							onClick={ handleSave }
							disabled={ ! canSave }
							isBusy={ isSaving }
						>
							{ isSaving
								? __( 'Saving…', 'mediaron-block-shortcuts-for-gb' )
								: __( 'Save to Asset Library', 'mediaron-block-shortcuts-for-gb' ) }
						</Button>
					</div>
				</>
			) }
		</Modal>
	);
};

export default SaveSVGToAssetLibraryModal;
