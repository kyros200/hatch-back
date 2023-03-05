const chat = (io, client, info) => {
    client.on('sendChat', ({message, channel , toUser}) => {
        const userInfo = info.loggedUsers.find(user => user.id === client.id)

        console.log(`${userInfo.user}: ${message}`)

        let path = io

        if(channel === "room") path = path.to(userInfo.room)
        if(channel === "user") path = path.to(toUser)

        path.emit("receiveChat", {
            message: `${userInfo.user}: ${message}`,
            channel: channel
        })
    })
}

module.exports = {chat};