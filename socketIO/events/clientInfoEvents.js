const { getUserInfo } = require("../helpers/user")

const clientInfoEvents = (io, client, info) => {
    client.on('getClientInfo', (cb) => {
        cb(getUserInfo(client, info))
    })

    client.on('getServerUsersCount', () => {
        client.emit("getServerUsersCount", info.loggedUsers.length)
    })

    client.on('getRoomUsersCount', () => {
        const userInfo = getUserInfo(client, info)

        io.to(userInfo.room).emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
    })
}

module.exports = { clientInfoEvents };