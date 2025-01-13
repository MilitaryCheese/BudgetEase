const express = require('express');
const app = express();
const dbConnect = require('./Database/index')
const errorHandler = require('./middleware/errorHandler')
const { PORT} = require('./config/index');
const router = require('./routes/index')
const cookies = require('cookie-parser');

dbConnect()

// Middleware
app.use(errorHandler);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
app.use(cookies());
app.use(router)


app.use(express.static('public'));



app.listen(PORT,  console.log("SERVER is running at: "+PORT))