const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_lock',
    execute: async (interaction, userChannel) => {
        await userChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: false });
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#a82d43').setDescription('🔒 Channel locked.')],
            ephemeral: true,
        });
    },
};
