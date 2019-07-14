const mongoose = require('mongoose');
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Company = mongoose.model('companies', companySchema);
module.exports = {
    Company
};