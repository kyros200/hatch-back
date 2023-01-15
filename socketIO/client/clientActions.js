const clientActions = (io, client, info) => {
    client.on('joinRoom', () => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)
        client.join(userInfo.room)
        client.emit("joinRoom", `${userInfo.user} entered room ${userInfo.room}`)
    })
}

module.exports = {clientActions};