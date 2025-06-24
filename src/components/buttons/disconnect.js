const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    id: 'vm_disconnect',
    execute: async (interaction, userChannel) => {
        const members = userChannel.members.filter(m => m.id !== interaction.member.id);
        if (!members.size) {
            return interaction.reply({
                embeds: [new EmbedBuilder().setColor('#a82d43').setDescription('❌ No other members in the channel.')],
                ephemeral: true,
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('vm_disconnect_select')
            .setPlaceholder('Choose members...')
            .setMinValues(1)
            .setMaxValues(members.size)
            .addOptions(
                members.map(m => ({
                    label: m.user.username,
                    value: m.id,
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#a82d43')
                    .setDescription(`🪝 <@${interaction.user.id}>: Select **members** below to **disconnect** from your channel`),
            ],
            components: [row],
            ephemeral: true,
        });
    },
};
