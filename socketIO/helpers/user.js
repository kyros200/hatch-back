const getUserInfo = (client, info) => {
    return info.loggedUsers.find(user => user.id === client.id)
}

module.exports = {getUserInfo};