const Flag = require("../models/FeatureFlag")
const Organization = require("../models/Organization")

const createFlag = async(req,res)=>{
    try {
        const flag = await Flag.create({
            organizationId : req.user.organizationId,
            featureKey : req.body.featureKey,
            enabled : req.body.enabled
        })
        return res.status(201).json(flag)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const listFlag = async(req, res) => {
    try {
        const flag = await Flag.find({
            organizationId : req.user.organizationId
        })
        return res.status(200).json(flag)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const updateFlag = async(req, res)=> {
    try {
        const flag = await Flag.findByIdAndUpdate(req.params.id, {
            featureKey : req.body.featureKey,
            enabled : req.body.enabled
        }, {new : true})
        if(!flag){
            return res.status(401).json({message : "Flag notfound"})
        }
        return res.status(201).json(flag)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const deleteFlag = async(req, res)=>{
    try {
        const flag = await Flag.findByIdAndDelete(req.params.id)
        if(!flag){
            return res.status(404).json({message : "Flag not found"})
        }
        return res.status(200).json({message : "Flag deleted successfully"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const listOrgNames = async(req, res)=>{
    try {
        const org = await Organization.find()
        return res.status(200).json(org)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const viewFlag = async(req, res)=>{
    try {
            const flag = await Flag.findOne({
                _id : req.params.id,
                organizationId : req.params.orgId
            })
            if(!flag){
                return res.status(404).json({message : "Flag not found"})
            }
            return res.status(200).json(flag)

    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}



module.exports = { createFlag, listFlag, updateFlag, deleteFlag, listOrgNames, viewFlag }