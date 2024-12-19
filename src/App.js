const express = require('express')

const app = express()

app.use("/",(req,res) => {
    res.send('Hello! Welcome to the Dashboard!')
})

app.use("/wishlist",(req,res) => {
    res.send("Hello! Welcome to the Wishlist Page!")
})

app.use("/cart",(req,res) => {
    res.send('Hello! Welcome to the Cart Page!')
})

app.use("/checkout",(req,res) => {
    res.send('Hello! Welcome to the Checkout Page!')
})

app.listen(3000, () => {
    console.log('Server is listening for requests on port 3000')
})