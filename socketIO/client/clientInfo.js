const clientInfo = (io, client, info) => {
    client.on('getClientInfo', () => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)
        client.emit("ReceiveClientInfo", userInfo)
    })
}

module.exports = {clientInfo};