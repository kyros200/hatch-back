const getRoomUsers = (room, info) => {
    if (room === undefined) return 0;
    const count = info.loggedUsers.filter(user => user.room == room).length;
    return count;
}

const getMaximumPlayers = (choosenProject) => {
    if(choosenProject === "tic") return 2
    else if(choosenProject === "reg") return 1
}

module.exports = {getRoomUsers, getMaximumPlayers};