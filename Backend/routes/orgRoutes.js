const express = require("express")
const auth = require("../middleware/authMiddleware")
const { superOnly } = require("../middleware/roleMiddleware")
const {createOrg, getAllOrg, deleteOrg} = require("../controllers/orgController")

const router = express.Router()

router.post("/create", auth, superOnly, createOrg)
router.get("/list", auth, superOnly, getAllOrg)
router.delete("/:id", auth, superOnly, deleteOrg)

module.exports = router