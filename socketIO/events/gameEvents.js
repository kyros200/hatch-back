const gameEvents = (io, client, info) => {
    client.on("startGame", (roomName) => {
        const choosenProject = roomName.substring(0, 3)
        const roomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(roomName)

        let newRoomInfo = {...info[choosenProject].rooms[roomIndex]}

        newRoomInfo.matchStatus = "STARTED"

        info[choosenProject].rooms[roomIndex] = newRoomInfo

        io.to(info[choosenProject].rooms[roomIndex].name).emit("getRoomInfo", newRoomInfo)
        client.emit("getRoomInfo", newRoomInfo)
    })    
}

module.exports = {gameEvents};