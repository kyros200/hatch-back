const cron = require('node-cron');

const start = () => {
    cron.schedule('*/3 * * * *', async () => {
        console.log("KEEPING ALIVE")
    }).start();
}

module.exports = { start };