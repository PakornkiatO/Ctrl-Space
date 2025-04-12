const express = require('express');

const app = express();

app.use('/api/v1/coworkings', require('./routes/coworkings.js'));

app.listen(5003, console.log('Server running on port 5003'));