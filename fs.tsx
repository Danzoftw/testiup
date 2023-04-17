import React, { FC, useMemo } from 'react'

import { Box, IconButton } from '@mui/material'
import { useDispatch } from 'react-redux'
import makeStyles from '@mui/styles/makeStyles'

import { AttachmentLink, PrintingSignOffsList, ReviewNoteIndicator, SignOffBar } from 'components'
import { FormattedTooltip, IconPicklist, IconPicklistProps, PicklistItem } from '@gtil/web-shared/src/components'
import { GlobalActionIcon, NavigationIcon, QuestionMarkCircleIcon, VertIcon } from '@gtil/web-shared/src/components/icons'
import {
	ID,
	PageContext,
	ResponseKeysDto,
	SelectedItemType,
	SignOffLevel,
	openEditAttachmentsModal,
	openSignOffBehalfOfModal,
	removeAttachmentAssociation,
	setGlobalActionWorkProgram,
} from 'store'
import { MaxReviewNoteCount } from '@gtil/rules'
import {
	useAttachmentDropUploader,
	useGetAttachmentSignOffs,
	useGetGlobalActionAssociations,
	useGetGlobalActionWorkPrograms,
	useGetIsEngagementReadOnly,
	useGetReviewNoteCount,
	useGetRightPanelFocusedItem,
	useGetRightPanelSubFocusedItem,
	useGetSignOffs,
	useTranslation,
	useWorkProgramHistory,
} from 'utils/hooks'

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		paddingLeft: '0.8rem',
		border: `0.1rem solid ${theme.palette.card.background}`,
		'&:hover': {
			cursor: 'pointer',
		},
	},
	rootSelected: {
		border: `0.1rem solid ${theme.palette.primary.main}`,
	},
	attachmentLinkWrapper: {
		display: 'flex',
	},
	attachmentLinkWrapperProcedure: {
		display: 'flex',
		marginLeft: '1.6rem',
	},
	buttonHidden: {
		visibility: 'hidden',
	},
	attachmentMetadata: {
		'@media print': {
			display: 'none',
		},
	},
	attachmentPrint: {
		display: 'none',
		padding: '0 1.6rem',

		'@media print': {
			display: 'block',
		},
	},
}))

export type AttachmentBarProps = {
	attachmentId: ID
	associationKeys: ResponseKeysDto
	showPreliminarySignOffs: boolean
	isReference?: boolean
}

// these specific values are used to align with signoffs while subtracting the width of the 0.1rem borders around attachments
const PreliminaryProcedureButtonWidth = '18.55rem'
const ProcedureButtonWidth = '18.05rem'

const AttachmentBar: FC<AttachmentBarProps> = ({ attachmentId, associationKeys, showPreliminarySignOffs, isReference = false }) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const attachmentBarTranslation = useTranslation('attachments.attachmentBar')
	const t = useTranslation('')
	const history = useWorkProgramHistory()
	const isReadOnlyMode = useGetIsEngagementReadOnly()
	const getGlobalActionWorkProgramsFn = useGetGlobalActionWorkPrograms()
	const globalActionWps = getGlobalActionWorkProgramsFn(undefined, attachmentId)
	const getGlobalActionAssociations = useGetGlobalActionAssociations()
	const globalActionAssociations = getGlobalActionAssociations(attachmentId, true)

	const { workProgram, instance, row, procedure } = associationKeys

	const attachmentFinalSignOffs = useGetAttachmentSignOffs(attachmentId, SignOffLevel.FinalReview)
	const wpFinalSignOffs = useGetSignOffs({ workProgram, instance }, SignOffLevel.FinalReview)
	const procedureFinalSignOffs = useGetSignOffs({ workProgram, procedure, instance, row }, SignOffLevel.FinalReview)

	const finalSignOffs = [...attachmentFinalSignOffs, ...wpFinalSignOffs, ...procedureFinalSignOffs]

	const { focusedItemId, focusedItemType } = useGetRightPanelFocusedItem(PageContext.WorkProgram) || {}
	const { subFocusedItemId, subFocusedItemType } = useGetRightPanelSubFocusedItem(PageContext.WorkProgram) || {}

	const isParentFocused = () => {
		if (procedure) {
			return focusedItemId === procedure && focusedItemType === SelectedItemType.Procedure
		} else {
			return focusedItemId === workProgram && focusedItemType === SelectedItemType.WorkProgram
		}
	}

	const isSelected = isParentFocused() && subFocusedItemType === SelectedItemType.Attachment && subFocusedItemId === attachmentId

	const reviewNoteCount = useGetReviewNoteCount({
		attachment: attachmentId,
	})

	const isProcedure = !!procedure

	const onSelectAttachment = (evt: React.MouseEvent<HTMLElement>) => {
		evt.preventDefault()
		evt.stopPropagation()

		history.setFocusedAttachment({
			attachment: attachmentId,
			workProgram,
			procedure,
			instance,
			row,
		})
	}

	const {
		getRootProps,
		getInputProps,
		open: openFilePickerDialog,
	} = useAttachmentDropUploader({ replaceAttachmentId: attachmentId }, { disabled: isReadOnlyMode, maxFiles: 1, noDrag: true })

	// START GLOBAL ACTION OPTIONS
	const globalActionOptions: Array<PicklistItem> = globalActionWps.map((wp) => {
		return {
			id: `globalActionAdd-${attachmentId}-option-${wp.workProgram}_${wp.instance}`,

			disabled: false,
			label: wp.title,
			onClick: () => {
				dispatch(setGlobalActionWorkProgram(wp.workProgram, wp.instance))
				history.addGlobalActions({ selectedItemType: SelectedItemType.Attachment, id: attachmentId })
			},
		} as PicklistItem
	})
	// END GLOBAL ACTION OPTIONS

	let removeRefTitle = attachmentBarTranslation('removeReference.confirmation.description')
	let replaceAttachTitle = attachmentBarTranslation('replaceAttachment.confirmation.description')
	if (finalSignOffs.length > 0) {
		removeRefTitle = attachmentBarTranslation('removeReference.confirmationWithSignOff.description')
		replaceAttachTitle = attachmentBarTranslation('replaceAttachment.confirmationWithSignOff.description')
	}
	const menuItems: Array<PicklistItem> = useMemo(() => {
		return [
			{
				id: `edit-${attachmentId}`,
				label: attachmentBarTranslation('edit'),
				onClick: () => {
					dispatch(openEditAttachmentsModal(attachmentId))
				},
			},
			{
				id: `removeReference-${attachmentId}`,
				label: attachmentBarTranslation('removeReference'),
				onClick: () => {
					dispatch(
						removeAttachmentAssociation({
							attachmentId,
							workProgram,
							instance,
							procedure,
						}),
					)
				},
				confirmationPopover: {
					// If there are final signOffs on the procedure, then show a different message
					title: removeRefTitle,
					buttonText: attachmentBarTranslation('removeReference.confirmation.button'),
					destructive: true,
				},
			},
			{
				id: `replaceAttachment-${attachmentId}`,
				label: attachmentBarTranslation('replaceAttachment'),
				onClick: openFilePickerDialog,
				confirmationPopover: {
					// If there are final signOffs on the procedure, then show a different message
					title: replaceAttachTitle,
					buttonText: attachmentBarTranslation('replaceAttachment.confirmation.button'),
					destructive: true,
				},
			},
			{
				id: `addReviewNote-${attachmentId}`,
				label: attachmentBarTranslation('addReviewNote'),
				disabled: reviewNoteCount.open >= MaxReviewNoteCount,
				onClick: () => {
					// This id is used to select corresponding review notes to display in the right panel
					history.addReviewNote({ selectedItemType: SelectedItemType.Attachment, id: attachmentId })
				},
			},
			{
				id: `addGlobalAction-${attachmentId}`,
				disabled: false,
				label: attachmentBarTranslation('addGlobalAction'),
				children: globalActionOptions,
				childrenAnchorOrigin: { horizontal: 'left', vertical: 'top' },
				childrenTransformOrigin: { horizontal: 'right', vertical: 'top' },
			},
			{
				id: `signOffOnBehalf-${attachmentId}`,
				label: attachmentBarTranslation('signOffOnBehalf'),
				onClick: () => {
					dispatch(openSignOffBehalfOfModal({ attachment: attachmentId }))
				},
			},
		]
	}, [
		attachmentId,
		attachmentBarTranslation,
		openFilePickerDialog,
		reviewNoteCount,
		globalActionOptions,
		dispatch,
		workProgram,
		instance,
		procedure,
		history,
		removeRefTitle,
		replaceAttachTitle,
	])

	const onClickPicklist = () => {
		history.setFocusedAttachment({
			workProgram,
			instance,
			procedure,
			attachment: attachmentId,
		})
	}

	const picklistProps: IconPicklistProps = {
		menuItems,
		menuId: 'attachment-bar-menu',
		icon: <VertIcon color="primary" />,
		anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
		transformOrigin: { vertical: 'top', horizontal: 'right' },
		onOpen: onClickPicklist,
		hide: isReference,
	}

	const handleGlobalActionClick = () => {
		history.setFocusedAttachment({
			attachment: attachmentId,
			workProgram,
			procedure,
			instance,
			row,
		})
		history.showGlobalActions()
	}
	const buttonWidth = showPreliminarySignOffs ? PreliminaryProcedureButtonWidth : ProcedureButtonWidth
	// For the 2 buttons (review note indicator, and global actions) they are hidden but take up space
	// so each procedure has a uniform look whether or not it has any buttons
	// Since attachments do not have guidance items, a hidden placeholder is put in place of the guidance button to maintain spacing
	return (
		<>
			<Box pr={0.65} data-testid={`attachment-bar-${attachmentId}`} className={`${classes.root} ${isSelected ? classes.rootSelected : ''}`} onClick={onSelectAttachment}>
				<Box className={isProcedure ? classes.attachmentLinkWrapperProcedure : classes.attachmentLinkWrapper} display="flex" maxWidth="calc(100% - 44rem)">
					<AttachmentLink id={attachmentId} associationKeys={associationKeys} isReference={isReference} />
				</Box>
				<Box display="flex" alignItems="center" justifyContent="flex-start" onClick={(evt) => evt.stopPropagation()} className={classes.attachmentMetadata}>
					<Box flex={5}>
						<SignOffBar attachmentId={attachmentId} disableSigningOff={isReference} showPreparer showReviewer />
					</Box>
					<Box minWidth={buttonWidth} display="flex" alignItems="center">
						<ReviewNoteIndicator
							id={attachmentId}
							instance={instance}
							row={row}
							reviewNoteCount={reviewNoteCount.open}
							selectedItemType={SelectedItemType.Attachment}
							parentItemType={procedure ? SelectedItemType.Procedure : SelectedItemType.WorkProgram}
							parentId={procedure || workProgram}
							alwaysShowIcon={true}
							hidden={isReadOnlyMode || reviewNoteCount.created === 0}
						/>
						<FormattedTooltip title={t('globalActions.display')} data-testid={`global-action-panel-display-button-tooltip`}>
							<IconButton
								color="primary"
								onClick={handleGlobalActionClick}
								data-testid={`${attachmentId}-global-action-button`}
								className={!globalActionAssociations.length ? classes.buttonHidden : ''}
								size="large">
								<GlobalActionIcon />
							</IconButton>
						</FormattedTooltip>
						<IconButton data-testid={`placeholder-guidance-button`} className={classes.buttonHidden} size="large">
							{/*This button is not meant to be displayed. It is a placeholder so that spacing between procedures and attachments are the same*/}
							<QuestionMarkCircleIcon />
						</IconButton>
						<IconButton data-testid={`placeholder-navigate-button`} className={classes.buttonHidden} size="large">
							<NavigationIcon />
						</IconButton>
						<div {...getRootProps({ onClick: (event) => event.stopPropagation() })}>
							<input {...getInputProps()} />
						</div>
					</Box>
					{!isReadOnlyMode && (
						<Box justifySelf="end">
							<FormattedTooltip title={t('workProgram.configuration')} data-testid={`workprogram-configuration-tooltip`}>
								<IconPicklist {...picklistProps} />
							</FormattedTooltip>
						</Box>
					)}
				</Box>
			</Box>
			<Box className={classes.attachmentPrint}>
				<PrintingSignOffsList attachmentId={attachmentId} />
			</Box>
		</>
	)
}

export default AttachmentBar
