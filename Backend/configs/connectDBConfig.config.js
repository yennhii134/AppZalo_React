const mongoose = require('mongoose');
require('dotenv').config()
const mongoDB_URL = `mongodb+srv://${process.env.mongoDB_USER}:${process.env.mongoDB_PASSWORD}@tranthiyennhi.gttgeaw.mongodb.net/${process.env.mongoDB_DB_Name}?retryWrites=true&w=majority`

exports.connectDB = async ()=>{
    return await mongoose.connect(mongoDB_URL)
    .catch((err)=>{console.log(`ErrorDB: ${err}`);})
}