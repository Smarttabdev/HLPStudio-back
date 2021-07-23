var bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")

const { User, Role } = require("../models")
const config = require("../config/auth.config")

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const role = await Role.findOne({
      where: {
        name: req.body.role,
      },
    })
    // [lbl] start:
    // const identify = Math.random().toString(36).substring(5, 15)
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var identify = '';
    for ( var i = 0; i < 10; i++ ) {
        identify += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    // const double = User.findOne({
    //   where: {
    //     identify
    //   }
    // })

    // if(double) goto start
    await User.create({
      username: req.body.username,
      email: req.body.email,
      receiver: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: role.id,
      allow: false,
      identify,
      contactTextE: 'Unfortunately we are not able to give an estimate based on your given information. But we receive your request. We will email you a detailed evaluation.',
      contactTextF: 'Antamiesi tietojen pohjalta järjestelmämme ei voinut antaa sinulle riittävän tarkkaa arvioita. Jätä kuitenkin yhteystietosi niin välittäjämme tekevät arvion ja toimittavat sen sähköpostiisi..'
    })
    res.status(200).send({ message: "Success!" })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
}

exports.signin = async (req, res) => {
  console.log(req, res)
  try {
    console.log("Fetching user by email for login");
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
      include: [{ model: Role, as: "roles" }],
      //nclude: [{ model: Role }],
    })
    console.log(user, "loginUser")
    if (!user) {
      return res.status(404).send({ message: "User Not found." })
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      })
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    })

    // if (user.role) {
    if (user.roles.name === "company") {
      if (!user.allow) {
        return res.status(401).send({
          accessToken: null,
          message: "You are a unallowed user!",
        })
      }
    }
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      identify: user.identify ? user.identify : '',
      role: user.roles.name,
      receiver: user.receiver,
      contactTextE: user.contactTextE,
      contactTextF: user.contactTextF,
      accessToken: token,
    })
    // Role.findOne({where: { id: user.role }}).then(result => {
    // })
    // } else {
    //   return res.status(401).send({
    //     accessToken: null,
    //     message: "You are a unautherized user!"
    //   })
    // }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}

exports.getUser = async (req, res) => {
  const user = await User.findOne({ where: { id: req.body.user.id } })
  return res.status(200).send({
    id: user.id,
    identify: user.identify ? user.identify : '',
    username: user.username,
    email: user.email,
    role: req.body.user.roles.name,
    receiver: user.receiver,
    contactTextE: user.contactTextE,
    contactTextF: user.contactTextF
  })
}

exports.getCompany = async (req, res) => {
  const { identify } = req.body
  const data = await User.findOne({
    where: {
      identify,
    },
  })
  if (data) {
    return res.status(200).send({
      toCompany: data.id,
      receiver: data.receiver,
      contactTextE: data.contactTextE,
      contactTextF: data.contactTextF
    }) 
  } else {
    return res.status(400).send({
      message: "not found",
    })
  }
}
