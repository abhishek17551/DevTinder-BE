const express = require('express')

const app = express()

app.get("/user",
    (req,res,next) => {
    console.log('Handling the user route 1')
    res.send('1st response')
    
    next()
},
(req,res,next) => {
   
    console.log('Handling the user route 2')
    res.send('2nd response')
    next()
},
(req,res) => {
    console.log('Handling the user route 3')
    res.send('3rd response')
},
       
)

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