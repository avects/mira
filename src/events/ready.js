const cleanActiveRooms = require('../utils/cleanActiveRooms');

module.exports = (client) => {
    client.once('ready', async () => {
        console.log(`✅ Mira está lista como ${client.user.tag}`);
        await cleanActiveRooms(client);
    });
};
