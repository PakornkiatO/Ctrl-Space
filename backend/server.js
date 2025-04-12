const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

app.use('/api/v1/coworkings', require('./routes/coworkings.js'));

const PORT = process.env.PORT;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' on port ', PORT));

process.on('unhandleRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
});