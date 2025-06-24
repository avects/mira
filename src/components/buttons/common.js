const fs = require('fs');
const path = require('path');
const activeRoomsPath = path.join(__dirname, '../../commands/server-configuration/voicemaster/data/activeRooms.json');

function isOwner(channelId, userId) {
    if (!fs.existsSync(activeRoomsPath)) return false;
    const activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
    const room = activeRooms[channelId];
    return room && room.ownerId === userId;
}

module.exports = { isOwner };
