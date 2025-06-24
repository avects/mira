const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    id: 'vm_info',
    execute: async (interaction, userChannel, room) => {
        const embed = new EmbedBuilder()
            .setColor('#3c3b40')
            .setAuthor({ name: interaction.member.displayName, iconURL: interaction.user.displayAvatarURL() })
            .setTitle(userChannel.name)
            .setDescription(`**Owner:** <@${room.ownerId}> (\`${room.ownerId}\`)`)
            .addFields(
                { name: 'Locked:', value: userChannel.permissionOverwrites.cache.get(interaction.guild.roles.everyone.id)?.deny.has('Connect') ? '❌' : '✅', inline: true },
                { name: 'Created:', value: `<t:${Math.floor(room.createdAt / 1000)}:R>`, inline: true },
                { name: 'Bitrate:', value: `${userChannel.bitrate}kbps`, inline: true },
                { name: 'Connected:', value: `${userChannel.members.size}`, inline: true }
            );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
