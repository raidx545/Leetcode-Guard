const dotenv = require('dotenv')

const mongoose = require('mongoose')

dotenv.config()

const DB = process.env.DATABASE_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(DB);

        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;