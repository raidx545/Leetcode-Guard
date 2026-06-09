const dotenv = require('dotenv')
const app = require('./app');
const mongoose = require('mongoose')
const PORT = process.env.PORT;


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URI;

mongoose.connect(DB)
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));



app.listen(PORT, () => {
    console.log("Server is running on http://127.0.0.1:3000/")
})