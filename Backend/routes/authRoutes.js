const express = require("express")

const router = express.Router()

const {superLogin, signup, login} = require("../controllers/authController")

router.post("/superadmin-login", superLogin)
router.post("/signup", signup)
router.post("/login", login)

module.exports = router
