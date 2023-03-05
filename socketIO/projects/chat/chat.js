const chat = (io, client, info) => {
    client.on('sendChat', ({message, room}) => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        console.log(`${userInfo.user}: ${message}`)

        let path = io

        if(userInfo.room) path = path.to(userInfo.room)

        path.emit("receiveChat", {
            message: `${userInfo.user}: ${message}`,
            channel: room
        })
    })
}

module.exports = {chat};