const { getMinimumPlayers, getMaximumPlayers } = require("../helpers/room")
const { v4 }  = require("uuid")
const { updateCount, updateRoomStatus, updateRoomLeavingCountToOthers } = require("../helpers/update")
const { getUserInfo } = require("../helpers/user")

const roomEvents = (io, client, info) => {
    client.on('joinRoom', (name, cb) => {
        client.join(name)

        const userInfo = getUserInfo(client, info)

        // updating user room to server
        let newLoggedUsers = []
        info.loggedUsers.map((loggedUser) => {
            if(userInfo.id === loggedUser.id) {
                newLoggedUsers.push({...loggedUser, room: name})
            }
            else newLoggedUsers.push({...loggedUser})
        }) 

        info.loggedUsers = newLoggedUsers

        //updating room count to server
        const choosenProject = name.substring(0, 3)
        const newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(name)
        info[choosenProject].rooms[newRoomIndex].playersConnected++
        info[choosenProject].rooms[newRoomIndex].playersConnectedInfo.push(userInfo)

        updateRoomStatus(io, info, choosenProject, newRoomIndex)
        updateCount(io, client, info)

        cb(name)
    })

    client.on('leaveRoom', (name, isHost, cb) => {
        client.leave(name)
        if(isHost) {
            //Close Room, force others in room to exit
            io.to(getUserInfo(client, info).room).emit("forcedLeaveRoom")
        }

        // updating user room to server
        let newLoggedUsers = []
        info.loggedUsers.map((loggedUser) => {
            if(getUserInfo(client, info).id === loggedUser.id) {
                delete loggedUser.room
                newLoggedUsers.push({...loggedUser})
            }
            else newLoggedUsers.push({...loggedUser})
        }) 

        info.loggedUsers = newLoggedUsers

        //updating room count to server
        const choosenProject = name.substring(0, 3)
        if (!choosenProject) 
            cb(false)

        let newRoomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(name)

        if(info[choosenProject].rooms[newRoomIndex]){
            info[choosenProject].rooms[newRoomIndex].playersConnected--
            info[choosenProject].rooms[newRoomIndex].playersConnectedInfo = info[choosenProject].rooms[newRoomIndex].playersConnectedInfo.filter((p) => {
                return p.id != getUserInfo(client, info).id
            })
        }

        updateRoomStatus(io, info, choosenProject, newRoomIndex)
        updateCount(io, client, info)
        updateRoomLeavingCountToOthers(io, info, choosenProject, newRoomIndex)

        cb(true)
    })

    client.on("getProjectRooms", (choosenProject, cb) => {
        return cb(info[choosenProject]?.rooms)
    });

    client.on("createRoom", ({name, choosenProject}, cb) => {
        const newRoom = {
            roomId: v4(),
            name: `${choosenProject}-${name}`,
            createdByName: getUserInfo(client, info).user,
            // createdById: getUserInfo(client, info).id,
            createdAt: new Date(),
            playersConnected: 0,
            playersConnectedInfo: [],
            playersMinimum: getMinimumPlayers(choosenProject),
            playersMaximum: getMaximumPlayers(choosenProject),
            status: getMaximumPlayers(choosenProject) > 1 ? "OPEN" : "FULL",
            matchStatus: "NOT_STARTED"
        }

        info[choosenProject]?.rooms.push(newRoom)

        console.log(`created room for ${choosenProject} with the name "${name}"!`)

        return cb(newRoom)
    });

    client.on("getRoomInfo", (name, cb) => {
        const choosenProject = name.substring(0, 3)
        const roomIndex = info[choosenProject].rooms.map((room) => room.name).indexOf(name)
        
        cb(info[choosenProject].rooms[roomIndex])
    })
}

module.exports = {roomEvents};