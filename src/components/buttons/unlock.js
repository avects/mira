const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_unlock',
    execute: async (interaction, userChannel) => {
        await userChannel.permissionOverwrites.edit(interaction.guild.roles.everyone, { Connect: true });
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#7ab158').setDescription('🔓 Channel unlocked.')],
            ephemeral: true,
        });
    },
};
