const { checkVictory } = require('./utils.js')

const tictactoe = (io, client, info) => {
    client.on('tic-start', ({name: roomName}, cb) => {
        const choosenProject = roomName.substring(0, 3)

        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(roomName)
        
        if(!info[choosenProject].rooms[newRoomIndex].matchInfo) {
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
        }

        cb(info[choosenProject].rooms[newRoomIndex].matchInfo)
    })

    client.on('tic-action', ({user, cell, roomName}) => {
        const choosenProject = roomName.substring(0, 3)

        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(roomName)

        const newEvent = `${roomName} turn ${info[choosenProject].rooms[newRoomIndex].matchInfo.events.length + 1}: ${user.user} choosed row ${cell[0]} column ${cell[1]}`
        
        info[choosenProject].rooms[newRoomIndex].matchInfo.board[cell[0]][cell[1]] = info[choosenProject].rooms[newRoomIndex].matchInfo.symbol
        info[choosenProject].rooms[newRoomIndex].matchInfo.events.push({user, cell, roomName, message: newEvent})
        const isFinished = checkVictory(info[choosenProject].rooms[newRoomIndex].matchInfo)

        if(isFinished === "O" || isFinished === "X") {
            info[choosenProject].rooms[newRoomIndex].matchInfo.winner = user
            info[choosenProject].rooms[newRoomIndex].matchInfo.events.push({winner: user.user, message: `${user.user} won!!!`})
            info[choosenProject].rooms[newRoomIndex].matchStatus = "ENDED"
            console.log(`${choosenProject} match finished in room ${roomName}`)
        } else if (isFinished === "T") {
            info[choosenProject].rooms[newRoomIndex].matchInfo.winner = {}
            info[choosenProject].rooms[newRoomIndex].matchInfo.events.push({winner: "", message: `${user.user} tied the match!!!`})
            info[choosenProject].rooms[newRoomIndex].matchStatus = "ENDED"
            console.log(`${choosenProject} match finished in room ${roomName}`)
        } else {
            info[choosenProject].rooms[newRoomIndex].matchInfo.turn = info[choosenProject].rooms[newRoomIndex].matchInfo.turn === 0 ? 1 : 0
            info[choosenProject].rooms[newRoomIndex].matchInfo.symbol = info[choosenProject].rooms[newRoomIndex].matchInfo.symbol === "O" ? "X" : "O"
        }

        //each action made we need to update every player
        io.to(roomName).emit("tic-update", info[choosenProject].rooms[newRoomIndex].matchInfo)
    })
}

module.exports = { tictactoe };