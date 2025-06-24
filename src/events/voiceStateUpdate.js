const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'commands', 'server-configuration', 'voicemaster', 'data', 'config.json');
const activeRoomsPath = path.join(__dirname, '..', 'commands', 'server-configuration', 'voicemaster', 'data', 'activeRooms.json');

module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (oldState.channelId === newState.channelId) return;
        if (!newState.channelId || !newState.guild || !newState.member) return;

        const user = newState.member;
        const guild = newState.guild;
        const joinedChannel = newState.channel;

        if (!fs.existsSync(configPath)) return;
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const guildConfig = config[guild.id];
        if (!guildConfig || !guildConfig.generator) return;

        const generatorId = guildConfig.generator;

        if (joinedChannel.id === generatorId) {
            const category = joinedChannel.parent;

            try {
                const newChannel = await guild.channels.create({
                    name: `${user.displayName}'s room`,
                    type: 2, // GuildVoice
                    parent: category ?? null,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            allow: ['Connect'], // Ahora el canal estará desbloqueado
                        },
                        {
                            id: user.id,
                            allow: ['Connect', 'ManageChannels', 'MoveMembers'],
                        },
                    ],
                });

                await user.voice.setChannel(newChannel);

                // Guardar en activeRooms.json
                let activeRooms = {};
                if (fs.existsSync(activeRoomsPath)) {
                    activeRooms = JSON.parse(fs.readFileSync(activeRoomsPath, 'utf8'));
                }
                activeRooms[newChannel.id] = {
                    ownerId: user.id,
                    createdAt: Date.now()
                };
                fs.writeFileSync(activeRoomsPath, JSON.stringify(activeRooms, null, 2));

                // Eliminar si se queda vacío
                const interval = setInterval(() => {
                    if (!newChannel.members.size) {
                        newChannel.delete().catch(() => {});
                        delete activeRooms[newChannel.id];
                        fs.writeFileSync(activeRoomsPath, JSON.stringify(activeRooms, null, 2));
                        clearInterval(interval);
                    }
                }, 1000);
            } catch (err) {
                console.error('[VoiceMaster Error]', err);
            }
        }
    });
};
