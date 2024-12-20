const mongoose= require('mongoose')

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://abhishekoct998:ljW7KYMapDzgmTUq@namastenodejs.bisz3.mongodb.net/DevTinder")
}

module.exports = connectDB

