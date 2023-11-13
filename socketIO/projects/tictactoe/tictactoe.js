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

        const gameRoom = info[choosenProject].rooms[newRoomIndex]

        gameRoom.matchInfo.board[cell[0]][cell[1]] = gameRoom.matchInfo.symbol

        const isFinished = checkVictory(gameRoom.matchInfo)

        let newEvent = `${roomName} turn ${gameRoom.matchInfo.events.length + 1}: ${user.user} choosed row ${cell[0] + 1} column ${cell[1] + 1}.`
        
        if(isFinished === "T") {
            newEvent += " It's a Tie!"
        }

        if(isFinished === "O" || isFinished === "X") {
            newEvent += ` ${isFinished} won!`
        }

        gameRoom.matchInfo.events.push({user, cell, roomName, message: newEvent})

        if(isFinished === "O" || isFinished === "X") {
            gameRoom.matchInfo.winner = user
            gameRoom.matchStatus = "ENDED"
            console.log(`${choosenProject} match finished in room ${roomName}`)
        } else if (isFinished === "T") {
            gameRoom.matchInfo.winner = {}
            gameRoom.matchStatus = "ENDED"
            console.log(`${choosenProject} match finished in room ${roomName}`)
        } else {
            gameRoom.matchInfo.turn = gameRoom.matchInfo.turn === 0 ? 1 : 0
            gameRoom.matchInfo.symbol = gameRoom.matchInfo.symbol === "O" ? "X" : "O"
        }

        //each action made we need to update every player
        io.to(roomName).emit("tic-update", info[choosenProject].rooms[newRoomIndex].matchInfo)
    })
}

module.exports = { tictactoe };