const mongoose = require("mongoose")


const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL).then(()=>{
            console.log("DB connected successfully 🎉")
        })
    } catch (err) {
        console.log("Failed to connect DB",err);
        
    }
}

module.exports = connectDB