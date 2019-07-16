const router = require('express').Router()
const { Computer } = require('./../models/computer.model')
const { isAndLogic, noLogicInQuery, make$andQuery } = require('./../helpers/query-helper')

router.get('/', async (req, res) => {
    const {take, skip} = req.query;
    const options = {skip: +skip, limit: +take};
    // const options = null;
    res.send(await Computer.find({}, null, options))
});

router.post('/', async (req, res) => {
    const { take, skip, filter, filterLogic } = req.body;
    let query = {}

    if (noLogicInQuery(req.body)) {
        const [queryObj] = filter;
        query[new String(queryObj.field).capitalize()] = typeof queryObj.value == 'string'
        ? new RegExp(queryObj.value, 'gi')
        : queryObj.value
    } else if (isAndLogic(req.body)){
        query.$and = make$andQuery(filter)
    }
    /* filter logic == 1 ? or ::: filterLogic == 2 -> and */
    // if (Array.isArray(filter)) {
    //     if (filter.length > 1) {
    //         filter.forEach((filter, i, self) => {
    //             if(filter.logic == 1) {
    //                 if (filtersObj[filter.field] && filtersObj[filter.field].hasOwnProperty('$in')) {
    //                     filtersObj[filter.field] = {
    //                         $in: [...filtersObj[filter.field].$in, filter.value]
    //                     };
    //                 } else {
    //                     filtersObj[filter.field] = {
    //                         $in: [filter.value]
    //                     };
    //                 }
    //             }
    //             if (filter.logic == 2) {
    //                 if (filtersObj[filter.field] && filtersObj[filter.field].hasOwnProperty('$and')) {
    //                     filtersObj[filter.field] = {
    //                         $and: [...filtersObj[filter.field]['$and'], filter.value]
    //                     };
    //                 } else {
    //                     filtersObj[filter.field] = {
    //                         $and: [filter.value]
    //                     };
    //                 }
    //             }
    //         });
    //     }
    // }
    if (query && query.$and) {
        for (let prop in query['$and']) {
            console.log(query.$and[prop])
        }
    } else {
        console.log(query)
    }
    
    const computers = await Computer.find(query)
    .skip(skip)
    .limit(take);
    res.send(computers);
});

module.exports = router;