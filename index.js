const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const bcrypt = require('bcryptjs')
const chalk = require('chalk')

const app = express()

// database
const { Role, User, Message, Chatuser, sequelize } = require("./app/models")

// routes
const api = require("./app/routes")

var corsOptions = {
  origin: "*",
}

// Static path setting
app.use(express.static(path.join(__dirname, "/public")))

// Cors setting
app.use(cors(corsOptions))
app.use(cors())
app.options("*", cors())

/** Socket IO */
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const {
  ADD_MESSAGE,
  UPDATE_ROOM_USERS,
} = require('./app/actions/socketio');
const { exit } = require("process")

// const { JOIN } = require('./helpers/socketEvents');

app.use(function (req, res, next)
{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,"
  )
  next()
})

sequelize.sync({ force: false, alter: true }).then(() =>
{
  console.log("Create table..")
  initial()
})

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "100mb", extended: true }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }))

// routes
app.use("/api", api)

// frontend route
app.get("/*", cors(), (req, res) =>
{
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.set('io', io);

let userTypings = {};

/** Socket IO Connections */
io.on('connection', socket =>
{
  console.log('socket connected')
  var currentUser = null
  var toUser = null
  var currentUserId = null
  var currentUserinfo = null

  /** Socket Events */
  socket.on('disconnect', async () =>
  {
    console.log('disconenttt')
    await Chatuser.update({
      socketId: ''
    }, { where: { socketId: socket.id } })
    console.log("A user disconnected", socket.id);


  });

  /** Join User */
  socket.on('joined', async data =>
  {
    // JOIN(socket, data);
    console.log(data, 'joineddddddddddddd')
    const role = await Role.findOne({
      where: {
        name: 'admin'
      }
    })
    var admininfo = await User.findOne({
      where: {
        role: role.id
      }
    })
    var admin = await Chatuser.findOne({
      where: {
        email: admininfo.email
      }
    })
    console.log(admininfo.email)
    if (data.role === 'admin')
    {
      currentUser = 'admin'
      const toUserInfo = await Chatuser.findOne({
        where: {
          id: data.toUserId
        }
      })
      toUser = toUserInfo.socketId
      if (admin)
      {
        await Chatuser.update({
          ip: data.user ? data.user.ip : '',
          socketId: socket.id,
          country: data.user ? data.user.country : '',
          city: data.user ? data.user.city : '',
          role: role.id
        }, { where: { email: admin.email } })
      } else
      {
        const chatuser = new Chatuser({
          email: admin.email,
          ip: data.user ? data.user.ip : '',
          socketId: socket.id,
          country: data.user ? data.user.country : '',
          city: data.user ? data.user.city : '',
          role: role.id
        })
        await chatuser.save()
      }
    } else
    {
      console.log('----------')
      currentUser = 'user'
      userRole = await Role.findOne({
        where: {
          name: 'user'
        }
      })
      toUser = admin.socketId
      const exist = await Chatuser.findOne({
        where: {
          email: data.email
        }
      })
      if (exist)
      {
        currentUserId = exist.id
        await Chatuser.update({
          ip: data.user.ip,
          socketId: socket.id,
          country: data.user ? data.user.country : '',
          city: data.user ? data.user.city : '',
          role: userRole.id
        }, { where: { email: data.email } })
        currentUserinfo = {
          id: exist.id,
          ip: data.user.ip,
          socketId: socket.id,
          country: data.user ? data.user.country : '',
          city: data.user ? data.user.city : '',
          role: userRole.id
        }
      } else
      {
        const chatuser = new Chatuser({
          email: data.email,
          ip: data.user ? data.user.ip : '',
          socketId: socket.id,
          country: data.user ? data.user.country : '',
          city: data.user ? data.user.city : '',
          role: userRole.id
        })
        await chatuser.save()
        currentUserId = chatuser.id
        currentUserinfo = chatuser
      }
      console.log(toUser, currentUserId, '0000000')
      socket.broadcast
        .to(toUser)
        .emit('joined', { currentUserinfo, state: true });
    }

  });

  let setToUser = async (data) =>
  {
    if (data && data.chatuserId)
    {
      const toUserInfo = await Chatuser.findOne({
        where: {
          id: data.chatuserId
        }
      })
      toUser = toUserInfo.socketId
    } else
    {
      const role = await Role.findOne({
        where: {
          name: 'admin'
        }
      })
      var admininfo = await User.findOne({
        where: {
          role: role.id
        }
      })
      var admin = await Chatuser.findOne({
        where: {
          email: admininfo.email
        }
      })
      toUser = admin.socketId
    }
  }

  /** User Typing Events */
  socket.on('userTyping', async (data) =>
  {
    setToUser(data)
    console.log(toUser, 'userTyping')
    socket.broadcast
      .to(toUser)
      .emit('receivedUserTyping', { currentUserId, state: true });
  });

  socket.on('removeUserTyping', async (data) =>
  {
    setToUser(data)
    socket.broadcast
      .to(toUser)
      .emit('receivedUserTyping', { currentUserId, state: false });
  });

  /** New Message Event */
  socket.on('newMessage', async data =>
  {
    await setToUser(data)
    const newMessage = await ADD_MESSAGE(data);
    socket.broadcast
      .to(toUser)
      .emit('receivedNewMessage', { newMessage, currentUserId });
  });

  /** Reconnected: Update Reconnected User in Room */
  socket.on('reconnectUser', data =>
  {
    console.log('reconnectUserrrrrrrrrrrrrr')
    currentRoomId = data.room._id;
    data.socketId = socket.id;
    if (socket.request.headers.referer.split('/').includes('room'))
    {
      socket.join(currentRoomId, async () =>
      {
        socket.emit('reconnected');
        await UPDATE_ROOM_USERS(data);
      });
    }
  });
});



// set port, listen for requests
const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () =>
{
  console.log(chalk.blue.bold(`Server is running on port ${chalk.red.bold(PORT)}.`))
});

async function initial()
{
  try
  {
    await Role.findOrCreate({
      where: {
        name: "user",
      },
    })

    await Role.findOrCreate({
      where: {
        name: "admin",
      },
    })

    const role = await Role.findOne({
      where: {
        name: "admin",
      },
    })

    await User.findOrCreate({
      where: {
        username: "admin",
        email: "vladislav.ivanilov2019@gmail.com",
      },
      defaults: {
        password: bcrypt.hashSync("ASqw12!@", 8),
        role: role.id,
        allow: true,
      },
    })

    await Chatuser.findOrCreate({
      where: {
        email: "vladislav.ivanilov2019@gmail.com",
      },
      defaults: {
        email: "vladislav.ivanilov2019@gmail.com",
        role: role.id
      },
    })

    console.log(chalk.green.bold("DataBase initialize success!"))
  } catch (e)
  {
    console.log(e)
  }
}
