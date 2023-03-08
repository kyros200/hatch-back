const { getRoomUsers, killRoom, changeRoomStatus } = require('./room')

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

const updateRoomStatus = (io, info, choosenProject, roomIndex) => {
    if(info[choosenProject].rooms[roomIndex].playersConnected === info[choosenProject].rooms[roomIndex].playersMaximum)
        changeRoomStatus(info, choosenProject, roomIndex, "FULL")
    else if(info[choosenProject].rooms[roomIndex].playersConnected === 0)
        killRoom(info, choosenProject, roomIndex)
    else if(info[choosenProject].rooms[roomIndex].playersConnected < info[choosenProject].rooms[roomIndex].playersMaximum)
        changeRoomStatus(info, choosenProject, roomIndex, "OPEN")
    io.emit("updateLobbies")
}

module.exports = {updateCount, updateLobbies, updateRoomStatus};