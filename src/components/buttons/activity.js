const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    id: 'vm_activity',
    execute: async (interaction) => {
        const activities = [
            { label: 'Poker Night', value: 'poker' },
            { label: 'YouTube Together', value: 'youtube' },
            { label: 'Chess In The Park', value: 'chess' },
        ];

        const menu = new StringSelectMenuBuilder()
            .setCustomId('vm_activity_select')
            .setPlaceholder('Choose an activity...')
            .addOptions(activities);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('#dca60d')
                    .setDescription(`🚴 <@${interaction.user.id}>: Select an **activity** from the **dropdown** to start!`),
            ],
            components: [row],
            ephemeral: true,
        });
    },
};

// Luego también el handler de `vm_activity_select` solo responde con el mensaje de advertencia.
