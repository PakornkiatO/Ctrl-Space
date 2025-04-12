const express = require('express');
const dotenv = require('dotenv');

dotenv.config({path: './config/config.env'});

const app = express();

app.use('/api/v1/coworkings', require('./routes/coworkings.js'));

const PORT = process.env.PORT;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' on port ', PORT));