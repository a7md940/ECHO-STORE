const mongoose = require('mongoose');

const app = require('./app')

const { Inches } = require('./models/inches.model')
const { Processor } = require('./models/processor.model')
const { Computer } = require('./models/computer.model')

mongoose.connect('mongodb://mongo:27017/computer_store')
    .then((res) => console.log('******************/ DB CONNECTED!!! /******************'))
    .catch((err) => console.log('DB FAILD!'));

    (async () => {
        console.log('wait for setting up DATABASE')
        const computers = await Computer.find({})
        const inches = await Computer.find({}).distinct('Inches')
        const RAMS = Computer.find({}).distinct('RAM')
        const ram_cap = await Computer.find({}).distinct('ram_cap')

        const INCHES = await Inches.find({})
        const processors = await Processor.find({})

        RAMS.then(async (rams) =>  {
            if (!ram_cap.length) {
                for (const ram of rams) {
                    for (const computer of computers) {
                        if (computer.get('RAM') == ram.toString()) {
                            const ramAsNumber = +(ram.split('').reverse().slice(2, ram.length).reverse().join(''))
                            computer.ram_cap = ramAsNumber
                            await computer.save()
                        }
                    }
                }
            }

        })

        if (INCHES.length !== 18) {
            for (const inch of inches) {
                const i = new Inches({Inches: inch})
                await i.save()
            }
        }

        if (processors.length !== 5) {
            const processor1 = new Processor({family: 'i7'})
            const processor2 = new Processor({family: 'i5'})
            const processor3 = new Processor({family: 'i3'})
            const processor4 = new Processor({family: 'Intel'})
            const processor5 = new Processor({family: 'AMD'})
            await processor1.save()
            await processor2.save()
            await processor3.save()
            await processor4.save()
            await processor5.save()
            
            await Processor.find({}).then(async (ps) => {
                if (ps.length === 5) {
                    const i7 = ps.find(x => x.get('family') == 'i7')
                    const i5 = ps.find(x => x.get('family') == 'i5')
                    const i3 = ps.find(x => x.get('family') == 'i3')
                    const Intel = ps.find(x => x.get('family') == 'Intel')
                    const AMD = ps.find(x => x.get('family') == 'AMD')
    
                    for (computer of computers) {
                        if (computer.get('CPU').includes('i7')) {
                            computer.cpu_cores = i7._id
                            await computer.save()
                        } else if (computer.get('CPU').includes('i5')) {
                            computer.cpu_cores = i5._id
                            await computer.save()
                        } else if (computer.get('CPU').includes('i3')) {
                            computer.cpu_cores = i3._id
                            await computer.save()
                        } else if (computer.get('CPU').includes('Intel')) {
                            computer.cpu_cores = Intel._id
                            await computer.save()
                        } else {
                            computer.cpu_cores = AMD._id
                            await computer.save()
                        }
                    }
                }
            })
        }
        console.log('setting up database DONE SUCESSFULLY!!')

    })();
        
const PORT = process.env.SERVER_PORT || 3000
app.listen(PORT, () => {
    console.log('app listening on PORT', PORT);
})