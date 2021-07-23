const sgMail = require("@sendgrid/mail")
// const nodemailer = require('nodemailer')

const {  Sequelize, Message, Chatuser, Role } = require("../models")
const chatuser = require("../models/chatuser")

const op = Sequelize.Op

exports.getChatContacts = async (req, res) => {
  try
  {
    var role = await Role.findOne({
      where: {
        name: 'admin'
      }
    })
    const users = await Chatuser.findAll({
      where: {
        role: {
           [op.ne]: role.id,  
        }
      },
      order: [
        ['updatedAt', 'ASC']
      ]
    })
    var chatContacts = []
    users.map(async (user, index) =>
    {
      var chatContents = await Message.findAll({
        where: {
          chatuserId: user.id
        },
        order: [
          ['createdAt', 'ASC']
        ]
      })
      chatContacts[index] = {
        country: user.country,
        city: user.city,
        ip: user.ip,
        email: user.email,
        chatContents,
        id: user.id,
        socketId: user.socketId,
        userTyping: false,
        unreadMessage: 0
      }
      console.log('333333333')
      if (index === users.length - 1)
      {
         return res.status(200).send({
          chatContacts
        })
      }
    })
    console.log('[00000000')
   
  } catch (err) {
    console.log(err, "0000000000000000")
    return res.status(400).json({
      message: err,
    })
  }
}

exports.getChatContents = async (req, res) =>
{
  try {
    const {email} = req.body
    const chatuser = await Chatuser.findOne({
      where: {
        email
      }
    })
    console.log(email, chatuser)
    const chatContents = await Message.findAll({
      where: {
        chatuserId: chatuser.id
      },
      order: [
        ['createdAt', 'ASC']
      ]
    })
    return res.status(200).send({
      chatContents
    })
  } catch (e) {
  
  }
}
