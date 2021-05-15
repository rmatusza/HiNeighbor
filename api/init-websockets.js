const express = require("express");
const { asyncHandler } = require('../utils');
const router = express.Router();
const cors = require('cors');
const app = require('../app')
const httpServer = require('http').createServer(app);

const options = {
	cors: {
		origin: ["http://localhost:3000"],
		credentials: true
	}
};
const io = require('socket.io')(httpServer, options)
httpServer.listen(8082)

io.on('connection', async (socket) => {
	console.log('User Conected')
	socket.on('add_user_to_room', async (roomNum) => {
		socket.join(roomNum)
		console.log('ROOOOOMMMSS:', io.sockets.adapter.rooms)
	})

	socket.on('message', (message, conversation, origin) =>{
		socket.to(message.recipient_id).emit(`instant_message`, message, conversation)
	})

	socket.on('message_from_seller_profile', (message, conversation) =>{
		console.log('CONVERSATION:', conversation)
		console.log('MESSAGE RECEIVED:', message.content)
		console.log('ROOM NUMBER:', message.recipient_id)
		io.to(message.recipient_id).to(message.author_id).emit(`message_from_seller_profile`, message, conversation)
	})

	socket.on('create_new_conversation', conversation => {
		console.log('NEW CONVERSATION:', conversation)
		console.log('ROOM NUMBERS:', conversation.recipient, conversation.creator)
		// socket.to(conversation.recipient).emit('new_conversation', conversation)
		io.to(conversation.creator).to(conversation.recipient).emit('new_conversation', conversation)
	})

	socket.on('disconnect-socket', () => {
		console.log('DISCONNECTING THE SOCKET')
		socket.disconnect()
	})
})

// router.get('/', asyncHandler(async (req, res) => {

// 	io.on('connection', async (socket) => {
// 		console.log('User Conected')
// 		const sockets = await io.fetchSockets()
// 		console.log('# of sockets connected:', sockets.length)
// 		console.log('# of rooms:', io.sockets.adapter.rooms)
// 		socket.on('add_user_to_room', async (roomNum) => {
// 			console.log('adding new user to room:', roomNum)
// 			socket.join(roomNum)
// 			const sockets = await io.fetchSockets()
// 			console.log('# of sockets connected:', sockets.length)
// 			console.log('ROOOOOMMMSS:', io.sockets.adapter.rooms)
// 		})
	
// 		socket.on('message', (message, conversation) =>{
// 			console.log('MESSAGE RECEIVED:', message.content)
// 			console.log('ROOM NUMBER:', message.recipient_id)
// 			socket.to(message.recipient_id).emit(`instant_message`, message, conversation)
// 		})
// 	})

// 	res.json(['init successfull'])
// }))

// module.exports = router