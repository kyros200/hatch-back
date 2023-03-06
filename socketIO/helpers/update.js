const { getRoomUsers } = require('./room')

const updateCount = (io, client, info) => {
    const userInfo = info.loggedUsers.find(user => user.id === client.id)

    io.emit("getServerUsersCount", info.loggedUsers.length)

    if(userInfo?.room) {
        io.to(userInfo.room).emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
        client.emit("getRoomUsersCount", getRoomUsers(userInfo.room, info))
    }
}

const updateLobbies = (io, client, info) => {
    io.emit("updateLobbies")
}

const updateRoomInfo = (io, info, choosenProject, newRoomIndex) => {
    if(info[choosenProject].rooms[newRoomIndex].playersConnected === info[choosenProject].rooms[newRoomIndex].playersMaximum)
        info[choosenProject].rooms[newRoomIndex].status = "FULL"
    else if(info[choosenProject].rooms[newRoomIndex].playersConnected === 0)
        info[choosenProject].rooms.splice(newRoomIndex, 1)
    else if(info[choosenProject].rooms[newRoomIndex].playersConnected < info[choosenProject].rooms[newRoomIndex].playersMaximum)
        info[choosenProject].rooms[newRoomIndex].status = "OPEN"
    io.emit("updateLobbies")
}

module.exports = {updateCount, updateLobbies, updateRoomInfo};