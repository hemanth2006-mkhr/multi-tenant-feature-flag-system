const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String
    },
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Organization"
    }
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel