const mongoose = require('mongoose')
const model = mongoose.model
const Schema = mongoose.Schema

const inchesSchema = new Schema({
    Inches: {
        type: Number
    }
})

const Inches = model('inches', inchesSchema)

module.exports = {
    Inches
}