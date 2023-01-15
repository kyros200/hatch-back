const getRoomUsers = (room, info) => {
    const count = info.loggedUsers.filter(user => user.room == room).length;
    return count;
}

module.exports = {getRoomUsers};