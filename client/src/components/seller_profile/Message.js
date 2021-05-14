import { useState } from 'react';
import { socket } from '../../App';
import {
	Dialog,
	DialogTitle,
	Button,
	FormControl,
  InputLabel,
	TextField
} from '@material-ui/core';

const Message = (props) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [composeMessageDialog, setComposeMessageDialog] = useState(false);
	const [confirmCancelMessageDialog, setConfirmCancelMessageDialog] = useState(false);
	const [content, setContent] = useState('');
	const [subject, setSubject] = useState('');
	const [buttonState, setButtonState] = useState(false);

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
		if(e.target.id === 'message'){
			setContent(e.target.value)
		}else{
			setSubject(e.target.value)
		}
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

	const sendMessage = async() => {
		
		const body = {
			content,
			recipientUsername: props.conversationData.recipientUsername,
			senderUsername: props.conversationData.senderUsername
		}
		console.log(body)
		let newMessage = await fetch(`http://localhost:5000/api/users/${props.conversationData.senderId}/send-message-to-user/${props.conversationData.recipientId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		})
		let conversationData = await newMessage.json()
		console.log('CONVERSATION DATA:', conversationData)
		if(conversationData.newConversation) {
			socket.emit('create_new_conversation', conversationData.newConversation[0])
		} else {
			await socket.emit('message_from_seller_profile', conversationData.newMessage, conversationData.previousConversation[0])
		}
		console.log(newMessage)
		closeComposeMessageDialogBox()
	}

	console.log(props)
	
	return (
		<div className="message-seller-buttton-container">
			<Button color="secondary" name="message-seller" variant={buttonState ? 'contained' : 'outlined'} onClick={openComposeMessageDialogBox}>message seller</Button>
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
						{/* <div className="subject-line-container">
							<InputLabel htmlFor="name-input" style={{color: "black"}}>Subject:</InputLabel>
							<FormControl>
								<Input id="subject" className="subject-line" onChange={handleInputChange} autoFocus style={{color: "black"}} />
							</FormControl>
						</div> */}
						<div className="message-box-container">
							<InputLabel className="message-field-label" style={{color: "black"}}>Message:</InputLabel>
							<FormControl>
								<TextField className="message-box" id="message" multiline={true} rows={10} variant="filled" onChange={handleInputChange}/>
							</FormControl>
						</div>
						<div className="send-and-cancel-buttons-container__message-seller">
							<div className="send-message-button-container">
								<Button color="secondary" variant='contained' onClick={sendMessage}>Send Message</Button>
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
								<Button color="secondary" variant='contained' onClick={closeConfirmCancelMessageDialogBox}>Cancel</Button>
							</div>
						</div>
					</div>
				</Dialog>
		</div>
	)
};

export default Message;