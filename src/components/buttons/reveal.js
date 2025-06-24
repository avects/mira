const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_reveal',
    execute: async (interaction, userChannel) => {
        await userChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: true });
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#7ab158').setDescription('🌐 Channel revealed.')],
            ephemeral: true,
        });
    },
};
