const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

const activeRoomsPath = path.join(__dirname, '../commands/server-configuration/voicemaster/data/activeRooms.json');

// Cargar todos los botones desde components/buttons/
const buttons = new Collection();
const buttonsPath = path.join(__dirname, '../components/buttons');
fs.readdirSync(buttonsPath).forEach(file => {
    const button = require(path.join(buttonsPath, file));
    if (button?.id && typeof button.execute === 'function') {
        buttons.set(button.id, button);
    }
});

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        // Slash command
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: '❌ Error executing command', ephemeral: true });
            }
            return;
        }

        // Botón
        if (interaction.isButton()) {
            const handler = buttons.get(interaction.customId);
            if (!handler) return;

            const userChannel = interaction.member.voice?.channel;
            if (!userChannel) {
                return interaction.reply({ content: '❌ You are not in a voice channel.', ephemeral: true });
            }

            if (!fs.existsSync(activeRoomsPath)) {
                return interaction.reply({ content: '❌ VoiceMaster is not configured properly.', ephemeral: true });
            }

            const activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
            const room = activeRooms[userChannel.id];

            // Los botones como 'claim' y 'info' pueden ser usados por cualquiera
            const bypassOwnerCheck = ['vm_claim', 'vm_info', 'vm_activity'];

            if (!room && !bypassOwnerCheck.includes(interaction.customId)) {
                return interaction.reply({ content: '❌ This is not a VoiceMaster channel.', ephemeral: true });
            }

            if (room && room.ownerId !== interaction.member.id && !bypassOwnerCheck.includes(interaction.customId)) {
                return interaction.reply({ content: '❌ You are not the owner of this channel.', ephemeral: true });
            }

            try {
                await handler.execute(interaction, userChannel, room);
            } catch (err) {
                console.error(err);
                return interaction.reply({ content: '❌ Error handling button interaction.', ephemeral: true });
            }
        }

        // Select menu (ej: disconnect y activity)
        if (interaction.isStringSelectMenu()) {
            const userChannel = interaction.member.voice?.channel;
            if (!userChannel) return;

            const activeRooms = fs.existsSync(activeRoomsPath)
                ? JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'))
                : {};

            const room = activeRooms[userChannel.id];
            const selected = interaction.values;

            if (interaction.customId === 'vm_disconnect_select') {
                const toKick = selected.filter(id => userChannel.members.has(id));
                for (const id of toKick) {
                    const member = userChannel.members.get(id);
                    if (member) await member.voice.disconnect().catch(() => {});
                }

                return interaction.reply({
                    content: `🪝 Disconnected ${toKick.length} member(s) from your channel.`,
                    ephemeral: true,
                });
            }

            if (interaction.customId === 'vm_activity_select') {
                return interaction.reply({
                    embeds: [
                        {
                            color: 0xdca60d,
                            description: `⚠️ <@${interaction.user.id}>: You can now start 🚀 **activities** in your app!\nThis **functionality** via interface buttons has been removed.`,
                        },
                    ],
                    ephemeral: true,
                });
            }
        }
    });
};
