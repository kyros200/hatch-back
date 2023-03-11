const {Server} = require('socket.io');
const { connectionEvents } = require('./events/connectionEvents')
const { clientInfoEvents } = require('./events/clientInfoEvents')
const { roomEvents } = require('./events/roomEvents')
const { chat } = require('./projects/chat/chat')
const { updateCount } = require('./helpers/update')

const startIO = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [`http://localhost:3000`, `https://hatch.najjar.dev`]
        }
    });

    const info = {
        loggedUsers: [],
        tic: {
            rooms: []
        },
        reg: {
            rooms: []
        }
    };

    io.use((client, next) => {
        const clientQuery = client.handshake.query
        console.log(`login attempt: u=${clientQuery.user} p=${clientQuery.pass} ...`)
        if (clientQuery.pass != "1") {
            console.log(`failed. Abort`)
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
            id: client.id,
            user: userQuery.user
        })

        //update count to server
        updateCount(io, client, info)

        //get events
        connectionEvents(io, client, info)
        clientInfoEvents(io, client, info)
        roomEvents(io, client, info)

        //get events specific from projects & chat
        chat(io, client, info)
    });

}

module.exports = {startIO};