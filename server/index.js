const mongoose = require('mongoose');

const app = require('./app')

mongoose.connect('mongodb://mongo:27017/computer_store')
    .then((res) => console.log('DB CONNECTED!!!'))
    .catch((err) => console.log('DB FAILD!'));
    
        
const PORT = process.env.SERVER_PORT || 3000
app.listen(PORT, () => {
    console.log('app listening on PORT', PORT);
})