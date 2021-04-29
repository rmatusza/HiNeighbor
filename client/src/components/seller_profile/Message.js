import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	Dialog,
	DialogTitle,
	Button,
	FormControl,
  InputLabel,
  Input,
	TextareaAutosize,
	TextArea,
	TextField
} from '@material-ui/core';

const Message = (props) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [composeMessageDialog, setComposeMessageDialog] = useState(false)
	const [confirmCancelMessageDialog, setConfirmCancelMessageDialog] = useState(false)
	const [buttonState, setButtonState] = useState(false);
	const userId = useSelector(store => store.session.currentUser.id)

	const handleDialogOpen = async(recipientId) => {
		setDialogOpen(true)
		setButtonState(true)
	}

	const handleDialogClose = () => {
		setDialogOpen(false)
		setButtonState(false)
	}

	const openComposeMessageDialogBox = () => {
		setDialogOpen(false)
		setComposeMessageDialog(true)
	}

	const closeComposeMessageDialogBox = () => {
		setComposeMessageDialog(false)
		setButtonState(false)
	}

	const handleInputChange = (e) => {

	}

	const openConfirmCancelMessageDialogBox = () => {
		setConfirmCancelMessageDialog(true)
	}

	const closeConfirmCancelMessageDialogBox = () => {
		setConfirmCancelMessageDialog(false)
	}

	const confirmDeleteMessage = () => {
		setConfirmCancelMessageDialog(false)
		setComposeMessageDialog(false)
		setButtonState(false)

	}
	
	return (
		<div className="message-seller-buttton-container">
			<Button color="secondary" name="message-seller" variant={buttonState ? 'contained' : 'outlined'} onClick={() => handleDialogOpen(props.recipientId)}>message seller</Button>
				<Dialog
					open={dialogOpen}
					onClose={handleDialogClose}
				>
					<div className="message-seller-dialog-box">
						<DialogTitle>Would you like to start a new conversation with this seller?</DialogTitle>
						<div className="confirm-cancel-buttons__message-seller">
							<div className="confirm-button-container-message-seller">
								<Button color="secondary" variant='contained' onClick={openComposeMessageDialogBox}>Start a new conversation</Button>
							</div>
							<Button color="secondary" variant='contained' onClick={handleDialogClose}>Cancel</Button>
						</div>
					</div>
				</Dialog>

				<Dialog
					open={composeMessageDialog}
					onClose={closeComposeMessageDialogBox}
				>
					<div className="compose-message-container">
						<div className="subject-line-container">
							<InputLabel htmlFor="name-input" style={{color: "black"}}>Subject:</InputLabel>
							<FormControl>
								<Input id="name-input" className="subject-line" onChange={handleInputChange} autoFocus style={{color: "black"}} />
							</FormControl>
						</div>
						<div className="message-box-container">
							<InputLabel htmlFor="description-input" className="message-field-label" style={{color: "black"}}>Message:</InputLabel>
							<FormControl>
								{/* <Input id="description-input" onChange={handleInputChange} onClick={openDescriptionDialogBox} style={{color: "black"}}/> */}
								<TextField className="message-box" multiline={true} rows={10} id="description-input" variant="filled" onChange={handleInputChange}/>
							</FormControl>
						</div>
						<div className="send-and-cancel-buttons-container__message-seller">
							<div className="send-message-button-container">
								<Button color="secondary" variant='contained'>Send Message</Button>
							</div>
							<div className="cancel-message-button-container">
								<Button color="secondary" variant='contained' onClick={openConfirmCancelMessageDialogBox}>Cancel</Button>
							</div>
						</div>
					</div>
				</Dialog>

				<Dialog
					open={confirmCancelMessageDialog}
					onClose={closeConfirmCancelMessageDialogBox}
				>
					<div className="message-seller-dialog-box">
						<DialogTitle>Are you sure that you want to discard this message?</DialogTitle>
						<div className="confirm-and-cancel-delete-message-buttons-container__message-seller">
							<div className="delete-message-button-container">
								<Button color="secondary" variant='contained' onClick={confirmDeleteMessage}>Delete Message</Button>
							</div>
							<div className="cancel-delete-message-button-container">
								<Button color="secondary" variant='contained' onClick={openConfirmCancelMessageDialogBox}>Cancel</Button>
							</div>
						</div>
					</div>
				</Dialog>
		</div>
	)
};

export default Message;