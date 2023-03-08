const { getUserInfo } = require("../helpers/user")

const clientInfo = (io, client, info) => {
    client.on('getClientInfo', (cb) => {
        cb(getUserInfo(client, info))
    })
}

module.exports = {clientInfo};