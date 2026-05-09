const Organization = require("../models/Organization")
const Flag = require("../models/FeatureFlag")

const createOrg = async(req, res) => {
    try {
        if(!req.body){
            return res.status(401).json({message: "All fields are required"})
        }
        const created = await Organization.create(req.body)
        res.status(201).json(created)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const getAllOrg = async(req,res)=> {
    try {
        const org = await Organization.find()
        return res.status(200).json(org)
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

const deleteOrg = async(req,res)=> {
    try {
        const org = await Organization.findByIdAndDelete(req.params.id)
        if(!org){
            return res.status(404).json({message : "Organization not found"})
        }
        await Flag.deleteMany({ organizationId: req.params.id })
        return res.status(200).json({message : "Organization deleted successfully"})
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

module.exports = { createOrg, getAllOrg, deleteOrg }