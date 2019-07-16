const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/computer_store')
    .then((res) => console.log('DB CONNECTED!!!'))
    .catch((err) => console.log('DB FAILD!'));

// DB Models
const { Computer } = require('./models/computer.model');
const { Company } = require('./models/company.model');

// Routes
const computerRoute = require('./routes/computers.router');

// Helpers
require('./helpers/string.helper')
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api/computers', computerRoute);

app.listen(PORT, () => {
    console.log('app listening on PORT', PORT);
})