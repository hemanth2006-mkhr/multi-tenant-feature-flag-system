const FeatureFlag = require("../models/FeatureFlag")
const Organization = require("../models/Organization")

const checkFlag = async (req, res) => {
    try {
        const { orgId, featureKey } = req.body
        const flag = await FeatureFlag.findOne({
            organizationId: orgId,
            featureKey: featureKey.trim().toLowerCase()
        })
        if (!flag) {
            return res.status(404).json({ message: "Flag not found" })
        }
        return res.status(200).json({ enabled: flag.enabled })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const listFlag = async (req, res) => {
    try {
        const flag = await FeatureFlag.find({
            organizationId: req.params.id
        })
        return res.status(200).json(flag)
    } catch (error) {
        return res.status(500).json(error.message)
    }

}

module.exports = { checkFlag, listFlag }