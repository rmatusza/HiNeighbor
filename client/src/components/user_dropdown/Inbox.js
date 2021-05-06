import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInboxVisibility } from '../../actions/chatActions';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Button,
	Dialog,
	FormControl,
	TextField
} from '@material-ui/core'
import { BiUpArrowAlt } from "react-icons/bi";
import { socket } from '../../services/socket';

const Inbox = (props) => {
	const [conversations, setConversations] = useState([]);
	const [composeMessageDialog, setComposeMessageDialog] = useState(false);
	const [messageContent, setMessageContent] = useState('');
	const [recipientUsername, setRecipientUsername] = useState(null);
	const [recipientId, setRecipientId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [conversationId, setConversationId] = useState(null);
	const [convoArrayIdx, setConvoArrayIdx] = useState(null);
	const [connectedToSocket, setConnectedToSocket] = useState(false);
	// const currUserId = useSelector(store => store.session.currentUser.id);

	// const [socket, setSocket] = useState(null);
	const dispatch = useDispatch();

	// console.log(props)

	useEffect(() =>{
		(async() => {
			if(props.userInfo.userId){
				console.log('updating convos')
				let res = await fetch(`http://localhost:5000/api/users/${props.userInfo.userId}/find-conversations`)
				const conversations = await res.json()
				setConversations(conversations)
				if(connectedToSocket === false){
					// let roomNums = []
					// conversations.forEach(convo => {
					// 	roomNums.push(convo.id)
					// })
					// console.log(roomNums)
					// socket.emit('initialize_rooms', props.userInfo.userId)
					setConnectedToSocket(true)
				}
			}
		})()
	}, [])

	const fillInbox = async() => {
		const res = await fetch(`http://localhost:5000/api/users/${props.userInfo.userId}/find-conversations`)
		const conversations = await res.json()
		setConversations(conversations)
	}


	const updateMessageContent = (e) => {
		setMessageContent(e.target.value)
	}
	
	const removeMessagingBox = () => {
		dispatch(setInboxVisibility(false))
	}
	
	const openComposeMessageDialogBox = (convo, id, idx) => {
		console.log(convo)
		setConversationId(id)
		setConvoArrayIdx(idx)
		if(convo.creator === props.userInfo.userId){
			setRecipientId(convo.recipient)
			setRecipientUsername(convo.recipient_username)
		} else{
			setRecipientId(convo.creator)
			setRecipientUsername(convo.creator_username)
		}
		setMessages(convo.Messages)
		setComposeMessageDialog(true)
	}
	
	const closeComposeMessageDialogBox = () => {
		setComposeMessageDialog(false)
	}

	// const updateConversations = (messageContent, conversation) => {
	// 	console.log('callback successfull')
	// 	console.log(conversations)
	// 	conversations.forEach((convo, idx) => {
	// 		console.log('CONVO:', convo)
	// 		console.log('CONVERSATION', conversation)
	// 		if (convo.id === conversation.id){
	// 			convo.Messages.push(messageContent)
	// 			conversations.splice(idx, 1, conversation)
	// 		}
	// 		if(conversation.id === conversationId){
	// 			setMessages(conversation.Messages)
	// 		}
	// 	})
	// }

	const sendMessage = async() => {
		const body = {
			content: messageContent,
			recipientUsername: recipientUsername,
			senderUsername: props.userInfo.username
		}
		let res = await fetch(`http://localhost:5000/api/users/${props.userInfo.userId}/send-message-to-user/${recipientId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		})
		let newMessage = await res.json()
		console.log('CONVERSATIONS:', conversations)
		conversations[convoArrayIdx].Messages.push(newMessage)
		setMessages(conversations[convoArrayIdx].Messages)
		socket.emit('message', newMessage, conversations[convoArrayIdx])
		setMessageContent('')
	}

	

	socket.on('instant_message', (message, conversation) =>{
		console.log('CONVERSATIONS:', conversations)
		console.log(message)
		conversations.forEach(convo => {
			console.log(convo)
			if(convo.id === conversation.id){
				convo.Messages.push(message)
				setConversations(conversations)
			}

		})
		// updateConversations(messageContent, conversation)
	}) 

  return(
		<>
			<Accordion
				defaultExpanded={true}
			>
				<div className="accordion-top-tab__inbox">
					<AccordionSummary
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography>Messaging</Typography>
						<div className="up-arrow-container__inbox">
							<BiUpArrowAlt className="up-arrow"/>
						</div>
					</AccordionSummary>
				</div>
				<div className="close-messaging-container">
					<h4 className="close-messaging-container-text" onClick={removeMessagingBox}>Remove Messaging Box</h4>
				</div>
				{conversations.map((convo, idx) => {
					let lastIdx = convo.Messages.length-1
					let recipientName;
					let lastSender;
					if(convo.creator === props.userInfo.userId){
						recipientName = convo.recipient_username
					} else {
						recipientName = convo.creator_username
					}

					if(convo.Messages[lastIdx].author_id === props.userInfo.userId){
						lastSender = 'You'
					}else{
						lastSender = recipientName
					}
					
					return(
						<div className="conversation-container__inbox-messaging-accordion">
							<AccordionDetails key={idx} onClick={() => openComposeMessageDialogBox(convo, convo.id, idx)}>
								<Typography>
									<div className="recipient-name">
										{recipientName}
									</div>
									{`${lastSender}: ${convo.Messages[lastIdx].content}`}
								</Typography>
							</AccordionDetails>
						</div>
					)
				})}
				<Button onClick={fillInbox}>get conversations</Button>
			</Accordion>

			<Dialog
				open={composeMessageDialog}
				onClose={closeComposeMessageDialogBox}
			>
				<div className="conversation-container__inbox">
					{messages.map(msg => {
						return(
							<>
								<h4 className="username__messages-container">{msg.author_username}</h4>
								<div className="message__messages-container">
									<p>{msg.content}</p>
								</div>
							</>
						)
					})}
						<div className="message-box-container__inbox">
							<FormControl>
								<TextField className="message-box__inbox" id="message" multiline={true} rows={5} variant="outlined" color="secondary" value={messageContent} onChange={updateMessageContent}>
								</TextField>
							</FormControl>
						</div>
						<div className="send-and-cancel-buttons-container__inbox">
							<div className="send-button-container__inbox">
								<Button color="secondary" variant='contained' onClick={sendMessage}>Send</Button>
							</div>
							<div className="cancel-button__inbox">
								<Button color="secondary" variant='contained' onClick={closeComposeMessageDialogBox}>Close</Button>
							</div>
						</div>
				</div>
			</Dialog>
		</>
	)
}

export default Inbox;