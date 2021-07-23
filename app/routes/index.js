const express = require("express")
const path = require("path")

const router = express.Router()

const authRouter = require("./auth.routes")
const userRouter = require("./user.routes")
const adminRouter = require("./admin.routes")
const chatRouter = require("./chat.routes")

const { authJwt } = require("../middleware")

router.use("/auth", authRouter)
router.use("/", userRouter)
router.use("/admin", authJwt.verifyToken, adminRouter)
router.use("/chat", chatRouter)
router.get("/calculator-script", (req, res) => {
  res.sendFile(path.join(__dirname, "../config/calculator.script.js"))
})

module.exports = router
