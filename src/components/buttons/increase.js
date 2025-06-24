const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_increase',
    execute: async (interaction, userChannel) => {
        const increased = userChannel.userLimit + 1;
        await userChannel.setUserLimit(increased);
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor('#7ab158').setDescription(`➕ User limit increased to ${increased}.`)],
            ephemeral: true,
        });
    },
};
