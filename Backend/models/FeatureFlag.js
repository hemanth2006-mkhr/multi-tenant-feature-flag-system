const mongoose = require("mongoose")


const featureFlagSchema = new mongoose.Schema({
    organizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Organization"
    },
    featureKey : {
        type : String,
        required : true
    },
    enabled : {
        type : Boolean
    }
},{timestamps : true})

const featureFlagModel = mongoose.model("FeatureFlag", featureFlagSchema)

module.exports = featureFlagModel