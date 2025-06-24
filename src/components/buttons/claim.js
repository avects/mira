const fs = require('fs');
const path = require('path');
const embeds = require('../../constants/embeds');
const activeRoomsPath = path.join(__dirname, '../../commands/server-configuration/voicemaster/data/activeRooms.json');

module.exports = {
    id: 'vm_claim',
    async execute(interaction) {
        const channel = interaction.member.voice?.channel;
        if (!channel) {
            return interaction.reply({ embeds: [embeds.error('You are not in a voice channel.')], ephemeral: true });
        }

        let activeRooms = {};
        if (fs.existsSync(activeRoomsPath)) {
            activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
        }

        activeRooms[channel.id] = {
            ownerId: interaction.user.id,
            claimedAt: Date.now()
        };

        fs.writeFileSync(activeRoomsPath, JSON.stringify(activeRooms, null, 2));
        await channel.setName(`${interaction.user.username}'s room`);

        return interaction.reply({ embeds: [embeds.success('You claimed the channel.')], ephemeral: true });
    }
};
