const chat = (io, client, info) => {
    client.on('sendMessageRoom', (message) => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        console.log(`${userInfo.user}: ${message}`)

        io.to(userInfo.room).emit("receiveMessageRoom", message)
    })
}

module.exports = {chat};