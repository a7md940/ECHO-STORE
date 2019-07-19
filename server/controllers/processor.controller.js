const { Processor } = require('./../models/processor.model')

module.exports = {
    async index(req, res) {
        const pocessors = await Processor.find({})
        res.send(pocessors)
    }
}