const express = require("express")
const {adminOnly} = require("../middleware/roleMiddleware")
const auth = require("../middleware/authMiddleware")

const router = express.Router()

const { createFlag, listFlag, updateFlag, deleteFlag, listOrgNames, viewFlag } = require("../controllers/flagController")

router.post("/create", auth, adminOnly, createFlag)
router.get("/list", listFlag)
router.put("/:id", auth, adminOnly, updateFlag)
router.delete("/:id", auth, adminOnly, deleteFlag)
// router.get("/view/:orgId/:id", viewFlag)
router.get("/org-list", listOrgNames)

module.exports = router