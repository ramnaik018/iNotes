const mongoose = require('mongoose');


const mongoURI = process.env.DBURI

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Database")
    })
}

module.exports = connectToMongo;