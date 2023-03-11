const { getMaximumPlayers } = require("../helpers/room")
const { v4 }  = require("uuid")
const { updateCount, updateRoomStatus } = require("../helpers/update")
const { getUserInfo } = require("../helpers/user")

const roomEvents = (io, client, info) => {
    client.on('joinRoom', (name, cb) => {
        client.join(name)

        // updating user room to server
        let newLoggedUsers = []
        info.loggedUsers.map((loggedUser) => {
            if(getUserInfo(client, info).id === loggedUser.id) {
                newLoggedUsers.push({...loggedUser, room: name})
            }
            else newLoggedUsers.push({...loggedUser})
        }) 

        info.loggedUsers = newLoggedUsers

        //updating room count to server
        const choosenProject = name.substring(0, 3)
        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(name)
        info[choosenProject].rooms[newRoomIndex].playersConnected++

        updateRoomStatus(io, info, choosenProject, newRoomIndex)
        updateCount(io, client, info)

        cb(name)
    })

    client.on("getProjectRooms", (choosenProject, cb) => {
        return cb(info[choosenProject]?.rooms)
    });

    client.on("createRoom", ({name, choosenProject}, cb) => {
        const newRoom = {
            id: v4(),
            name: `${choosenProject}-${name}`,
            createdByName: getUserInfo(client, info).user,
            createdById: getUserInfo(client, info).id,
            createdAt: new Date(),
            playersConnected: 0,
            playersMaximum: getMaximumPlayers(choosenProject),
            status: getMaximumPlayers(choosenProject) > 1 ? "OPEN" : "FULL"
        }

        info[choosenProject]?.rooms.push(newRoom)

        console.log(`created room for ${choosenProject} with the name "${name}"!`)

        return cb(newRoom)
    });
}

module.exports = {roomEvents};