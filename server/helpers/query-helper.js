
const isAndLogic = (query) => Array.isArray(query.filter) && query.filter.length > 1 && query.filterLogic == 2

function make$andQuery(filterArray) {
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
        const fieldName = new String(childArr[0].field).capitalize();
        const fieldValues = childArr.map(x => typeof x.value == 'string' ? new RegExp(x.value, 'gi') : x.value);
        const query = {}
        query[fieldName] = {}
        query[fieldName]['$in'] = fieldValues;
        return query
    })
     return result;  
};

const noLogicInQuery = (queryOptions) => !queryOptions.filterLogic

module.exports = {
    isAndLogic,
    noLogicInQuery,
    make$andQuery
};