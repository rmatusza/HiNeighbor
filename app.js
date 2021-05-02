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
