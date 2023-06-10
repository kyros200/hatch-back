const { getUserInfo } = require('../../helpers/user')

const tictactoe = (io, client, info) => {
    client.on('tic-start', ({name: roomName}, cb) => {
        const choosenProject = roomName.substring(0, 3)

        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(roomName)
        
        info[choosenProject].rooms[newRoomIndex].matchInfo = {
            turn: Math.floor(Math.random() * 2 ),
            symbol: "O",
            board: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
            ],
            events: []
        }

        console.log(`${choosenProject} match starting in room ${roomName}`)
        cb(info[choosenProject].rooms[newRoomIndex].matchInfo)
    })

    client.on('tic-action', ({user, cell, roomName}) => {
        const choosenProject = roomName.substring(0, 3)

        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(roomName)

        const newEvent = `${roomName} turn ${info[choosenProject].rooms[newRoomIndex].matchInfo.events.length + 1}: ${user.user} choosed row ${cell[0]} column ${cell[1]}`
        
        info[choosenProject].rooms[newRoomIndex].matchInfo.board[cell[0]][cell[1]] = info[choosenProject].rooms[newRoomIndex].matchInfo.symbol
        info[choosenProject].rooms[newRoomIndex].matchInfo.turn = info[choosenProject].rooms[newRoomIndex].matchInfo.turn === 0 ? 1 : 0
        info[choosenProject].rooms[newRoomIndex].matchInfo.symbol = info[choosenProject].rooms[newRoomIndex].matchInfo.symbol === "O" ? "X" : "O"
        info[choosenProject].rooms[newRoomIndex].matchInfo.events.push({user, cell, roomName, message: newEvent})

        //each action made we need to update every player
        io.to(roomName).emit("tic-update", info[choosenProject].rooms[newRoomIndex].matchInfo)
    })
}

module.exports = { tictactoe };