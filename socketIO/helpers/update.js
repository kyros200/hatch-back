const { getRoomUsers } = require('./room')

const updateCount = (io, client, info) => {
    const userInfo = info.loggedUsers.find(user => user.id === client.id)

    io.emit("getServerUsersCount", info.loggedUsers.length)

    io.to(userInfo.room).emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
    client.emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
}

module.exports = {updateCount};