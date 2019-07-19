const { Inches } = require('./../models/inches.model')

module.exports = {
    async index(req, res) {
        res.send(await Inches.find({}))
    }
}