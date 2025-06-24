const { EmbedBuilder } = require('discord.js');

module.exports = {
    id: 'vm_decrease',
    execute: async (interaction, userChannel) => {
        if (userChannel.userLimit > 0) {
            const decreased = userChannel.userLimit - 1;
            await userChannel.setUserLimit(decreased);
            await interaction.reply({
                embeds: [new EmbedBuilder().setColor('#dca60d').setDescription(`➖ User limit decreased to ${decreased}.`)],
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                embeds: [new EmbedBuilder().setColor('#a82d43').setDescription(`❌ User limit is already unlimited.`)],
                ephemeral: true,
            });
        }
    },
};
