const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/computer_store')
    .then((res) => console.log('DB CONNECTED!!!'))
    .catch((err) => console.log('DB FAILD!'));

// DB Models
const { Computer } = require('./models/computer.model');
const { Company } = require('./models/company.model');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/api/computers', async (req, res) => {
    const {take, skip} = req.query;
    const options = {skip: +skip, limit: +take};
    // const options = null;
    res.send(await Computer.find({}, null, options))
});

app.post('/api/computers', async (req, res) => {
    const { take, skip, filter, filterLogic } = req.body;
    /* filter logic == 1 ? or ::: filterLogic == 2 -> and */
    let filtersObj = {};
    if (Array.isArray(filter)) {
        if (filter.length > 1) {
            filter.forEach((filter, i, self) => {
                if(filter.logic == 1) {
                    if (filtersObj[filter.field] && filtersObj[filter.field].hasOwnProperty('$in')) {
                        filtersObj[filter.field] = {
                            $in: [...filtersObj[filter.field].$in, filter.value]
                        };
                    } else {
                        filtersObj[filter.field] = {
                            $in: [filter.value]
                        };
                    }
                }
                if (filter.logic == 2) {
                    if (filtersObj[filter.field] && filtersObj[filter.field].hasOwnProperty('$and')) {
                        filtersObj[filter.field] = {
                            $and: [...filtersObj[filter.field]['$and'], filter.value]
                        };
                    } else {
                        filtersObj[filter.field] = {
                            $and: [filter.value]
                        };
                    }
                }
            });
        }
    }
    console.log(filtersObj);
    const computers = await Computer.find(
        {$and: [
            { OpSys: {$in: [ 'macOS', 'Windows 10' ]} },
            { Company: {$in: [ 'Google', 'HP', 'Apple']} }
        ]}
    )
    .skip(skip)
    .limit(take);
    res.send(computers);
});

app.listen(PORT, () => {
    console.log('app listening on PORT', PORT);
})