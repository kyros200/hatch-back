const getRoomUsers = (room, info) => {
    if (room === undefined) return 0;
    const count = info.loggedUsers.filter(user => user.room == room).length;
    return count;
}

const killRoom = (info, project, index) => {
    info[project].rooms.splice(index, 1)
}

const changeRoomStatus = (info, project, index, status) => {
    if(info[project].rooms[index])
        info[project].rooms[index].status = status
}

const getMinimumPlayers = (choosenProject) => {
    if(choosenProject === "tic") return 2
    else if(choosenProject === "reg") return 1
}

const getMaximumPlayers = (choosenProject) => {
    if(choosenProject === "tic") return 2
    else if(choosenProject === "reg") return 1
}

module.exports = {getRoomUsers, getMinimumPlayers, getMaximumPlayers, killRoom, changeRoomStatus};