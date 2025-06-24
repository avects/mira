const fs = require('fs');
const path = require('path');
const activeRoomsPath = path.join(__dirname, '../../commands/server-configuration/voicemaster/data/activeRooms.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_claim',
    execute: async (interaction, userChannel) => {
        const activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
        activeRooms[userChannel.id] = {
            ownerId: interaction.member.id,
            createdAt: Date.now()
        };
        fs.writeFileSync(activeRoomsPath, JSON.stringify(activeRooms, null, 2));

        await userChannel.setName(`${interaction.user.username}'s room`);

        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#7ab158').setDescription('🎙️ You claimed the channel.')],
            ephemeral: true,
        });
    },
};
