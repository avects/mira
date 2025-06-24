const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_ghost',
    execute: async (interaction, userChannel) => {
        await userChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false });
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#dca60d').setDescription('👻 Channel hidden.')],
            ephemeral: true,
        });
    },
};
