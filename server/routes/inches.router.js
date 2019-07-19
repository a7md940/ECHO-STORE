const inchesController = require('./../controllers/inches.controller')

module.exports = (app) => {
    app.get('/api/inches/all', inchesController.index)
}