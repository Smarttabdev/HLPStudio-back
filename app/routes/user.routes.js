const express = require("express")

const router = express.Router()

const controller = require("../controllers/user.controller")

router.post("/send-email", controller.sendMail)

module.exports = router