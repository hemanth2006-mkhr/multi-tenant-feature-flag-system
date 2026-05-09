const mongoose = require("mongoose")


const organizationSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
        required : true
    }
},{timestamps : true})

const organizationModel = mongoose.model("Organization", organizationSchema)

module.exports = organizationModel