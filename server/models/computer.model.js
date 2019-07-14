const mongoose = require('mongoose');

const computerSchema = new mongoose.Schema({
    Company: {
        type: String,
        required: true,
    },
    Product: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Inches: {
        type: String,
        required: true
    },
    Resolution: {
        type: String,
        required: true
    },
    RAM: {
        type: String,
        required: true
    },
    OpSys: {
        type: String,
        requird: true
    },
    Weight: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    CompanyId: {
        type: mongoose.Types.ObjectId,
        ref: 'companies'
    }
});
const Computer = mongoose.model('computers', computerSchema);

module.exports = {
    Computer
};