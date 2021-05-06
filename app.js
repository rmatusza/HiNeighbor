const cors = require('cors');
const createError = require('http-errors');
const cookieParser = require('cookie-parser')
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');
const csurf = require('csurf');
const userRouter = require('./api/users');
const itemsAndServicesRouter = require('./api/items-and-services')
const itemsRouter = require('./api/items')
const bearerToken = require("express-bearer-token");
const app = express();
const httpServer = require('http').createServer(app);
const options = {
  cors: {
    origin: ["http://localhost:3000"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
};
const io = require('socket.io')(httpServer, options)
let roomSet = new Set()
io.on('connection', socket => {
  console.log(roomSet)
  console.log('dis muh fuh done kuhnekted')
  socket.on('initialize_rooms', roomNum => {
    console.log('recieved command to initialize rooms')
    console.log('room nums:', roomNum)
    if(roomSet.has(roomNum)){
      return
    } else{
      socket.join(roomNum)
      roomSet.add(roomNum)
    }

    // roomNums.forEach(roomNum => {
    //   console.log(roomNum)
    //   socket.join(roomNum)
    // })
  })

  socket.on('message', (message, conversation) =>{
    console.log('MESSAGE RECEIVED:', message.content)
    console.log('ROOM NUMBER:', message.recipient_id)
    socket.to(message.recipient_id).emit('instant_message', message, conversation)
  })
})

httpServer.listen(8082)

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

// Security Middleware
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bearerToken())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/users", userRouter);
app.use("/api/items-and-services", itemsAndServicesRouter)
app.use("/api/items", itemsRouter)

// Serve React Application
// This should come after routes, but before 404 and error handling.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get(/\/(?!api)*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(function(_req, _res, next) {
  next(createError(404));
});

app.use(function(err, _req, res, _next) {
  res.status(err.status || 500);
  if (err.status === 401) {
    res.set('WWW-Authenticate', 'Bearer');
  }
  res.json({
    status: err.status,
    message: err.message,
    error: JSON.parse(JSON.stringify(err)),
  });
});

module.exports = app;
