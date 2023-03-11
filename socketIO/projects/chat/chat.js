const { getUserInfo } = require('../../helpers/user')

const chat = (io, client, info) => {
    client.on('sendChat', ({message, channel, toUser}) => {
        const userInfo = getUserInfo(client, info)

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

module.exports = { chat };