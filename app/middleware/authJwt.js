const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const { User, Role } = require("../models")

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"]

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      })
    }
    // req.userId = decoded.id
    User.findOne({
      where: {
        id: decoded.id,
      },
      include: [ { model: Role, as: 'roles' } ],
    }).then(res => {
        req.body.user = res;
        next()
      })
  })
}

const authJwt = {
  verifyToken: verifyToken,
}
module.exports = authJwt
