const {Server} = require('socket.io');
const { connection } = require('./client/connection')
const { clientInfo } = require('./client/clientInfo')
const { clientActions } = require('./client/clientActions')
const { chat } = require('./projects/chat/chat')
const { updateCount } = require('./helpers/update')

const startIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: `http://localhost:3000`
        }
    });

    const info = {
        loggedUsers: []
    };

    io.use((client, next) => {
        const clientQuery = client.handshake.query
        console.log(`login attempt: u=${clientQuery.user} p=${clientQuery.pass} ...`)
        if (clientQuery.pass != "1") {
            console.log(`failed`)
            next(new Error("User or Password incorrect! Please try Again"));
        } else {
            console.log("success! Going to connect...")
            next()
        }
    })
    
    io.on("connection", (client) => {
        const userQuery = client.handshake.query;
        console.log(`User "${userQuery.user}" Connected to the Server (${client.id})`)
        info.loggedUsers.push({
            // loggedAt: new Date(),
            id: client.id,
            user: userQuery.user,
            room: userQuery.room
        })
        updateCount(io, client, info)

        connection(io, client, info)
        clientInfo(io, client, info)
        clientActions(io, client, info)
        
        chat(io, client, info)
    });

}

module.exports = {startIO};