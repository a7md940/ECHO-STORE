const computerController = require('./../controllers/computer.controller')

module.exports = (app) => {
    app.get('/api/computers', computerController.index)
    app.post('/api/computers', computerController.filter)
}