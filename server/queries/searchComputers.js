/**
 * Searches through the Computer Collection
 * @param {object} criteria An object with a Product, Company, RAM, OpSys, CPU and Inches
 * @return {promises} A promise that resolves with search result
 */
module.exports = (criteria, query) => {
    if (criteria.searchText) {
        query.$text = { $search :  criteria.searchText.join(' ') }
    } 
}