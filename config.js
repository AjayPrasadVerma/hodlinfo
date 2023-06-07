const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
const connectBD = async () => {
    try {
        // mongodb connection String
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectBD;
