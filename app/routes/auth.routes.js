const express = require("express")

const router = express.Router()

const controller = require("../controllers/auth.controller")
const { verifySignUp, authJwt } = require("../middleware")

router.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    // verifySignUp.checkRolesExisted
  ],
  controller.signup
)

router.post("/get_user", [authJwt.verifyToken], controller.getUser)

router.post("/signin", controller.signin)
router.post("/get_company", controller.getCompany)

module.exports = router
