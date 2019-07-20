const { Computer } = require('./../models/computer.model')
const { Processor } = require('./../models/processor.model')
const { Inches } = require('./../models/inches.model')

const { isAndLogic, noLogicInQuery, make$andQuery } = require('./../helpers/query-helper')
const buildSearchQuery = require('../queries/searchComputers')
module.exports = {
    async filter(req, res) {
        const { take, skip, filter, filterLogic } = req.body;
        let query = {}
        if (filter.length === 1) {
            query = filter.map(x => {
                const field = x.field
                const q = {}
                q[field] = x.value
                return q
            })[0]
        }
       if (isAndLogic(req.body)){
            make$andQuery(filter, query)
        }
        if (query && query.$and) {
            for (let prop in query['$and']) {
                console.log('and query !!!!!', query.$and[prop])
            }
        } else {
            // console.log(query)
        }
        
        // const computers = await Computer.find(query)
        buildSearchQuery(req.body, query)
        console.log('builded query', query)
        const [computers, count] = await Promise.all([
            Computer.find(query).skip(skip).limit(take), 
            Computer.find(query).countDocuments()
        ])
    
        res.send({computers, count});
    },
    async index(req, res) {
        const {take, skip} = req.query;
        const options = {skip: +skip, limit: +take};
        // const options = null;
        res.send(await Computer.find({}, null, options))
    }
}