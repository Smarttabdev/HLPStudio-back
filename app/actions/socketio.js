const { Message, Chatuser, Role } = require('../models');

module.exports = {
    ADD_MESSAGE: async data =>
    {
        try {
        var message = {}
        if (data.email)
        {
            //user
            const user = await Chatuser.findOne({
                where: {
                    email: data.email
                }
            })
            const role = await Role.findOne({
                where: {
                    name: 'user'
                }
            })
            message = new Message({
                content: data.content,
                state: 'send',
                chatuserId: user.id,
                role: role.id,
                read: false
            })
            await message.save()
        } else
        {
            //admin
            const role = await Role.findOne({
                where: {
                    name: 'admin'
                }
            })
            message = new Message({
                content: data.content,
                state: 'receive',
                chatuserId: data.chatuserId,
                role: role.id,
                read: false
            })
            await message.save()
        }

        // return Message.populate(newMessage, {
        //     path: 'user',
        //     select: 'username social handle image'
        // });
            message.userTyping = false
        return message
        } catch (e) {
            console.log(e)
        }
        
    },
    // GET_MESSAGES: async data => {
    //     return await Message.find({ room: data.room._id }).populate('user', [
    //         'username',
    //         'social',
    //         'handle',
    //         'image'
    //     ]);
    // },
    // CREATE_MESSAGE_CONTENT: (room, socketId) => {
    //     const user = room.previous.users.find(user => user.socketId === socketId);

    //     return user && user.lookup.handle
    //         ? `${user.lookup.handle} has left ${room.updated.name}`
    //         : `Unknown User has left ${room.updated.name}`;
    // },
    // GET_ROOMS: async () => {
    //     return await Room.find({})
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // GET_ROOM_USERS: async data => {
    //     return await Room.findById(data.room._id)
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // UPDATE_ROOM_USERS: async data => {
    //     const room = await Room.findOne({ name: data.room.name })
    //         .select('-password')
    //         .populate('users.lookup', ['username', 'social', 'handle', 'image']);

    //     if (room) {
    //         if (
    //             room.users &&
    //             !room.users.find(user => user.lookup._id.toString() === data.user._id)
    //         ) {
    //             room.users.push({
    //                 // lookup: mongoose.Types.ObjectId(data.user._id),
    //                 socketId: data.socketId
    //             });
    //             const updatedRoom = await room.save();
    //             return await Room.populate(updatedRoom, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         } else {
    //             // Update user socket id if the user already exists
    //             const existingUser = room.users.find(
    //                 user => user.lookup._id.toString() === data.user._id
    //             );
    //             if (existingUser.socketId != data.socketId) {
    //                 existingUser.socketId = data.socketId;
    //                 await room.save();
    //             }
    //             return await Room.populate(room, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         }
    //     } else {
    //         return;
    //     }
    // },
    // FILTER_ROOM_USERS: async data => {
    //     const room = await Room.findById(mongoose.Types.ObjectId(data.roomId))
    //         .select('-password')
    //         .populate('users.lookup', ['username', 'social', 'handle', 'image']);
    //     if (room) {
    //         let previousUserState = Object.assign({}, room._doc);
    //         room.users = room.users.filter(user => user.socketId !== data.socketId);
    //         const updatedRoom = await room.save();
    //         return {
    //             previous: previousUserState,
    //             updated: await Room.populate(updatedRoom, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             })
    //         };
    //     }
    // }
};
