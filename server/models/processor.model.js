const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const processorSchema = new Schema({
    family: {
        type: String
    }
})

const Processor = model('processor', processorSchema)

module.exports = {
    Processor
}