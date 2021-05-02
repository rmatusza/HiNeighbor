import { useState } from 'react';
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	FormControl,
  InputLabel,
  Input,
	TextField
} from '@material-ui/core'
import { BiUpArrowAlt } from "react-icons/bi";

const Inbox = (props) => {
	const [conversations, setConversations] = useState([])
	const [composeMessageDialog, setComposeMessageDialog] = useState(false)
	const [messages, setMessages] = useState([])
	console.log(props.userId)
	const fillInbox = async() => {
		const res = await fetch(`http://localhost:5000/api/users/${props.userId}/find-conversations`)
		const conversations = await res.json()
		console.log(conversations)
		setConversations(conversations)
	}

	const openComposeMessageDialogBox = (messages) => {
		setMessages(messages)
		setComposeMessageDialog(true)
	}

	const closeComposeMessageDialogBox = () => {
		setComposeMessageDialog(false)
	}

	console.log(conversations)

  return(
		<>
			<Accordion>
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
				{conversations.map((convo, idx) => {
					console.log(convo.Messages)
					let name;
					if(convo.creator === props.userId){
						name = convo.recipient_username
					} else {
						name = convo.creator_username
					}
					
					return(
						<AccordionDetails key={idx} onClick={() => openComposeMessageDialogBox(convo.Messages)}>
							<Typography>
								{`${name}: ${convo.subject}`}
							</Typography>
						</AccordionDetails>
					)
				})}
				<Button onClick={fillInbox}>get conversations</Button>
			</Accordion>

			<Dialog
				open={composeMessageDialog}
				onClose={closeComposeMessageDialogBox}
			>
				<div className="messages-container__inbox">
					{messages.map(msg => {
						console.log(msg.content)
						let divType;
						if(msg.author_id === props.userId){
							divType = 'user-div'
						} else {
							divType = 'non-user-div'
						}
						console.log(divType)
						return(
							<>
								<h4 className="username__messages-container">{msg.author_username}</h4>
								<div className="message__messages-container">
									<p>{msg.content}</p>
								</div>
							</>
						)
					})}
				</div>
			</Dialog>
		</>
	)
}

export default Inbox;