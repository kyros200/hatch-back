const { getRoomUsers } = require('../helpers/room')
const { updateCount } = require('../helpers/update')

const connection = (io, client, info) => {
    // client.on('disconnecting', () => {
    // console.log(`User DISCONNECTING with ID: ${client.id}`)
    // remove from rooms? chat to say its logging out?
    // });

    client.on('disconnect', () => {
        updateCount(io, client, info)

        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        info.loggedUsers = info.loggedUsers.filter(user => user.id != client.id)

        console.log(`User "${userInfo.user}" DISCONNECTED (${client.id})`)
    });

    client.on('getServerUsersCount', () => {
        client.emit("getServerUsersCount", info.loggedUsers.length)
    })

    client.on('getRoomUsersCount', () => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        io.to(userInfo.room).emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
    })
}

module.exports = {connection};