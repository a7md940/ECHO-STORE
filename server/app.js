const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');

const computerRoutes = require('./routes/computers.router')
const processorRoutes = require('./routes/processor.router')
const inchesRoutes = require('./routes/inches.router')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors())

computerRoutes(app)
processorRoutes(app)
inchesRoutes(app)

module.exports = app