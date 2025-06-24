const fs = require('fs');
const path = require('path');

const activeRoomsPath = path.join(__dirname, '../commands/server-configuration/voicemaster/data/activeRooms.json');

module.exports = async (client) => {
    if (!fs.existsSync(activeRoomsPath)) return;

    let activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
    let updated = false;

    for (const channelId of Object.keys(activeRooms)) {
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) {
            delete activeRooms[channelId];
            updated = true;
        }
    }

    if (updated) {
        fs.writeFileSync(activeRoomsPath, JSON.stringify(activeRooms, null, 2));
        console.log('[VoiceMaster] Cleaned up invalid channels from activeRooms.json');
    }
};
