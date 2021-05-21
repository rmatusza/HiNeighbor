const express = require("express");
const app = require('./app')
const httpServer = require('http').createServer(app);

const options = {
	cors: {
		origin: "*",
		credentials: true
	}
};
const io = require('socket.io')(httpServer, options)

io.on('connection', (socket) => {
	socket.on('add_user_to_room', (roomNum) => {
		socket.join(roomNum)
	})

	socket.on('message', (message, conversation, origin) =>{
		io.to(message.recipient_id).emit(`instant_message`, message, conversation)
	})

	socket.on('message_from_seller_profile', (message, conversation) =>{
		io.to(message.recipient_id).to(message.author_id).emit(`message_from_seller_profile`, message, conversation)
	})

	socket.on('create_new_conversation', conversation => {
		io.to(conversation.creator).to(conversation.recipient).emit('new_conversation', conversation)
	})

	socket.on('disconnect-socket', () => {
		socket.disconnect()
	})
})

httpServer.listen(8082)
