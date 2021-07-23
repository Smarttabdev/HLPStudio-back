const sgMail = require("@sendgrid/mail")
// const nodemailer = require('nodemailer')

const { Sequelize, User } = require("../models")

const op = Sequelize.Op


exports.sendMail = async (req, res) =>
{
  try {
    const { firstName, lastName, email, message } = req.body
    console.log(firstName, lastName, email, message)
    sgMail.setApiKey(
        "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"
        // "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"
        // "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"
      )
      const msg = {
        // to: "vladislav.ivanilov2019@gmail.com",
        to: 'andranik.terzyan.13@gmail.com',
        from: `mikael@mikaeldacosta.com`,
        // from: 'andranik.terzyan.13@gmail.com',
        subject: "I want HLP-Studio",
        text: message,
        replyTo: email,
        html: `
            <h1>from ${firstName} ${lastName}</h1>
            <h3>${message}</h3>
            `,
      }
    await sgMail.send(msg)
    console.log('okkkkkkkkkkkkkk')
    
    return res.status(200).send({
      message: 'success'
    })
  } catch (e) {
    console.log(e)
  }
 
}
