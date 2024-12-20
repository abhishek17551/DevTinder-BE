const mongoose= require('mongoose')

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhishekoct998:ljW7KYMapDzgmTUq@namastenodejs.bisz3.mongodb.net/DevTinder")
}

module.exports = connectDB

connectDB().then(() => {
    console.log('DB connection established')
}).catch((err) => {
    console.log('Error in connecting to the DB', err)
})