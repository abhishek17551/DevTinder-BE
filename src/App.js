const express = require('express')
const  connectDB = require('./config/database')
const app = express()


connectDB().then(() => {
    console.log('DB connection established')
    app.listen(3000, () => {
        console.log('Server is listening for requests on port 3000')
    })
}).catch((err) => {
    console.log('Error in connecting to the DB', err)
})

