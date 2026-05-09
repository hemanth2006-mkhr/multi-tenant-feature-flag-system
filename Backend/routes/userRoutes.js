const express = require("express")
const { checkFlag, listFlag } = require("../controllers/userController")
const router = express.Router()


router.post('/check', checkFlag)
router.get('/list/:id', listFlag)

module.exports = router