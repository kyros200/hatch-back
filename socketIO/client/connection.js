const { getRoomUsers } = require('../helpers/room')
const { updateCount, updateRoomStatus } = require('../helpers/update')

const connection = (io, client, info) => {
    // client.on('disconnecting', () => {
    // console.log(`User DISCONNECTING with ID: ${client.id}`)
    // remove from rooms? chat to say its logging out?
    // });

    client.on('disconnect', () => {
        
        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        let choosenProject
        let newRoomIndex

        if (userInfo?.room) {
            choosenProject = userInfo?.room?.substring(0, 3)
            newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(userInfo?.room)
            info[choosenProject].rooms[newRoomIndex].playersConnected--
        }
        
        info.loggedUsers = info.loggedUsers.filter(user => user.id != client.id)
        
        updateCount(io, client, info)
        if(choosenProject !== undefined && newRoomIndex !== undefined)
        updateRoomStatus(io, info, choosenProject, newRoomIndex)

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