import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInboxVisibility, setConversations } from '../../actions/chatActions';
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
import { socket } from '../../App';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const Inbox = (props) => {
	const [conversations, setConversations] = useState([]);
	const [composeMessageDialog, setComposeMessageDialog] = useState(false);
	const [messageContent, setMessageContent] = useState('');
	const [recipientUsername, setRecipientUsername] = useState(null);
	const [recipientId, setRecipientId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [conversationIndex, setConversationIndex] = useState(null);
	const [lastMessage, setLastMessage] = useState([]);
	const currUserId = useSelector(store => store.session.currentUser.id);
	const currUsername = useSelector(store => store.session.currentUser.username)

	const dispatch = useDispatch();
	// console.log('PROPS INBOX:', props)
	// console.log('LAST RECEIVED MESSAGE:', lastMessage)
	useEffect(()=> {
		if(props.userInfo.userId){
			setConversations(props.userInfo.conversations)
		}
	}, [lastMessage, props, conversations])

	socket.removeAllListeners()

	socket.on(`instant_message`, (message, conversation) =>{
		conversations.forEach((convo, idx) => {
			if(convo.id === conversation.id && conversationIndex === idx){
				conversation.Messages.push(message)
				props.userInfo.conversations.splice(idx, 1, conversation)
				setConversations(props.userInfo.conversations)
				let updatedMessages = [...messages, message]
				setMessages(updatedMessages)
			} else if(convo.id === conversation.id) {
				conversation.Messages.push(message)
				props.userInfo.conversations.splice(idx, 1, conversation)
				let updatedMessages = [...lastMessage]
				updatedMessages.push(message)
				setLastMessage(updatedMessages)
				setConversations(props.userInfo.conversations)
			}
		})		
	}) 

	console.log(lastMessage.length)

	socket.on('message_from_seller_profile', (message, conversation) => {
		conversations.forEach((convo, idx) => {
			if(convo.id === conversation.id && conversationIndex === idx){
				conversation.Messages.push(message)
				props.userInfo.conversations.splice(idx, 1, conversation)
				setConversations(props.userInfo.conversations)
				let updatedMessages = [...messages, message]
				setMessages(updatedMessages)
			} else if(convo.id === conversation.id){
				conversation.Messages.push(message)
				props.userInfo.conversations.splice(idx, 1, conversation)
				let updatedMessages = [...lastMessage]
				updatedMessages.push(message)
				setLastMessage(updatedMessages)
				setConversations(props.userInfo.conversations)
			}
		})	
	})

	socket.on('new_conversation', conversation => {
		// console.log('NEW CONVERSATION:', conversation)
		props.userInfo.conversations.push(conversation)
		let message = conversation.Messages[0]
		let updatedMessages = [...lastMessage]
		updatedMessages.push(message)
		setLastMessage(updatedMessages)
		setConversations(props.userInfo.conversations)
	})


	const updateMessageContent = (e) => {
		setMessageContent(e.target.value)
	}
	
	const removeMessagingBox = () => {
		dispatch(setInboxVisibility(false))
	}
	
	const openComposeMessageDialogBox = (convo, id, idx) => {
		// console.log(convo)
		// console.log('CURR USER ID:', currUserId)
		setConversationIndex(idx)
		if(convo.creator ===currUserId){
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

	const emitMessage = (newMessage, currentConvo) => {
		// console.log('i got emmited')
		// console.log('CURRENT CONVO:', currentConvo)
		socket.emit('message', newMessage, currentConvo, {'from_seller_profile': false})

	}

	const sendMessage = async() => {
		const body = {
			content: messageContent,
			recipientUsername: recipientUsername,
			senderUsername: currUsername
		}

		// console.log(body)
		let res = await fetch(`http://localhost:5000/api/users/${currUserId}/send-message-to-user/${recipientId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body)
		})
		let { newMessage } = await res.json()
		// console.log('CONVERSATIONS:', conversations)
		let currentConvo = conversations[conversationIndex]
		let currentConvoMessages = currentConvo.Messages
		currentConvoMessages.push(newMessage)
		// dispatch(setConversations(conversations))
		setMessages(currentConvoMessages)
		setMessageContent('')
		emitMessage(newMessage, currentConvo)
	}

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
					if(convo.creator === currUserId){
						recipientName = convo.recipient_username
					} else {
						recipientName = convo.creator_username
					}

					if(convo.Messages[lastIdx].author_id === currUserId){
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
				{/* <Button onClick={fillInbox}>get conversations</Button> */}
			</Accordion>

			<Dialog
				open={composeMessageDialog}
				onClose={closeComposeMessageDialogBox}
			>
				<div className="conversation-container__inbox">
					{messages.map((msg, idx) => {
						return(
							<div key={idx}>
								<h4 className="username__messages-container">{msg.author_username}</h4>
								<div className="message__messages-container">
									<p>{msg.content}</p>
								</div>
							</div>
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