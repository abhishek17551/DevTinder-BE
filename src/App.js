const express = require('express')

const app = express()
const {adminAuth,userAuth} = require('./middlewares/auth')

app.all("/admin", adminAuth)

app.get("/admin/getAllData", (req,res) => {
    res.send('All data sent')
})
app.delete("/admin/deleteRecord", (req,res) => {
    res.send('Record Deleted')
})
app.get("/user", userAuth,
    (req,res) => {
    console.log('Handling the user route 1')
   res.send('User 1')
})

app.get("/wishlist",(req,res) => {
    res.send({productID : '3', name : "Red Tape Shoes"})
})

app.post("/wishlist",(req,res) => {
    res.send("Product added to wishlist!")
})

app.get("/cart/:productID",(req,res) => {
    console.log(req.params)
    res.send({productID : '2', name : "HRX Shoes"})
})

app.get("/cart",(req,res) => {
    res.send({productID : '2', name : "HRX Shoes"})
})

app.post("/cart",(req,res) => {
    res.send("Product added to cart!")
} )

app.delete("/cart",(req,res) => {
    res.send("Product removed from Cart!")
})

app.get("/checkout",(req,res) => {
    res.send('Hello! Welcome to the Checkout Page!')
})

app.get("/",(req,res) => {
    res.send('Hello! Welcome to the Dashboard!')
})

app.listen(3000, () => {
    console.log('Server is listening for requests on port 3000')
})