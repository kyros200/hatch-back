const cron = require('node-cron');

const start = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log("KEEPING ALIVE")
    }).start();
}

module.exports = { start };