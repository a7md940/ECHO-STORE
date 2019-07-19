const processorController = require('./../controllers/processor.controller')

module.exports = (app) => {
    app.get('/api/processors', processorController.index)
}