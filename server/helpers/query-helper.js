/**
 * tell if it's $and query operator
 * @param {object} queryFilter An Array of criteria filters
 * @return {boolean} A boolean that tell if it's an and logical query operation
 */
const isAndLogic = (query) => Array.isArray(query.filter) && query.filterLogic == 2

/**
 * Builds Query Object With $and Operator
 * @param {Array} filterArray An Array have object search criteria
 * @param {object} query the object query to build
 * @return {object} A query object like {$and:  : { fieldName: { $in : [...values] }, field2: {$in : [...values] } } }
 */
function make$andQuery(filterArray, query) {
    // clone arr to avoid side effects.
    let clonedFilter = [...filterArray];
    let result = [];

    for (let item of clonedFilter) {
        // find index of arr that contains same filter field
        const index = result.indexOf(result.find(x => {
            return x.find(y => y.field == item.field)
        }))
        // if its exist push it's sibling to
        if (result[index]) {
            result[index].push(item);
         } else {
        // else ==> it's the first item to push, wapping it in array.
            result.push([item]);
         }
    }
    result = result.map((childArr, i, self) => {
        const fieldName = new String(childArr[0].field);
        const fieldValues = childArr.map(filterObj => filterObj.value)
        const query = {}
        query[fieldName] = {}
        query[fieldName]['$in'] = fieldValues;
        console.log(query[fieldName].$in)
        return query
    })
    query.$and = result
     return { $and: result };  
};

/**
 * tell if it's single query object
 * @param {object} query An object has filterLogic property
 * @return {boolean} A boolean that tell if it's a single query object
 */
const noLogicInQuery = (queryOptions) => !queryOptions.filterLogic

module.exports = {
    isAndLogic,
    noLogicInQuery,
    make$andQuery
};