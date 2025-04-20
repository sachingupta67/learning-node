const mongoose = require("mongoose");
const uri = process.env.MONGO_DB_CONNECTION_STRING;

const connectDB = async () => await mongoose.connect(uri);
module.exports = { connectDB };
