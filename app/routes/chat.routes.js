const express = require("express")

const router = express.Router()

const controller = require("../controllers/chat.controller")

router.get("/get-chatcontacts", controller.getChatContacts)
router.post("/get-chatcontents", controller.getChatContents)

module.exports = router
