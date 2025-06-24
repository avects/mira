const {
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'data', 'config.json');
const activeRoomsPath = path.join(__dirname, '..', 'data', 'activeRooms.json');
const vmLogoPath = 'attachment://vm-logo.png';

module.exports = {
    name: 'voicemaster',
    aliases: [],
    permissions: [PermissionFlagsBits.Administrator],
    async execute(message, args) {
        if (!args[0] || args[0].toLowerCase() !== 'setup') {
            return message.reply({
                embeds: [{
                    color: 0xa82d43,
                    description: '❌ Usage: `voicemaster setup`'
                }]
            });
        }

        const { guild } = message;

        const category = await guild.channels.create({
            name: '📞 voice channels',
            type: ChannelType.GuildCategory,
        });

        const generatorChannel = await guild.channels.create({
            name: 'create',
            type: ChannelType.GuildVoice,
            parent: category.id,
        });

        const panelChannel = await guild.channels.create({
            name: 'panel',
            type: ChannelType.GuildText,
            parent: category.id,
        });

        const panelEmbed = new EmbedBuilder()
            .setAuthor({ name: 'VoiceMaster Interface', iconURL: guild.iconURL() })
            .setDescription(
                `Use the buttons below to control your voice channel.\n\n**Button Usage**\n` +
                `<:_:1387080783063289880> — \`Lock\` your channel\n` +
                `<:_:1387080808405401691> — \`Unlock\` your channel\n` +
                `<:_:1387080834502099058> — \`Ghost\` your channel\n` +
                `<:_:1387080851099095261> — \`Reveal\` your channel\n` +
                `<:_:1387080877900693676> — \`Claim\` your channel\n` +
                `<:_:1387080900096954398> — \`Disconnect\` someone\n` +
                `<:_:1387080931403370696> — \`Start\` an activity\n` +
                `<:_:1387080952190074993> — \`Info\` about your channel\n` +
                `<:_:1387080984616501329> — \`Increase\` user limit\n` +
                `<:_:1387080964819128431> — \`Decrease\` user limit`
            )
            .setColor('#3c3b40')
            .setThumbnail(vmLogoPath)
            .setFooter({ text: 'VoiceMaster by Mira' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vm_lock').setEmoji('1387080783063289880').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_unlock').setEmoji('1387080808405401691').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_ghost').setEmoji('1387080834502099058').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_reveal').setEmoji('1387080851099095261').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_claim').setEmoji('1387080877900693676').setStyle(ButtonStyle.Secondary),
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vm_disconnect').setEmoji('1387080900096954398').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_activity').setEmoji('1387080931403370696').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_info').setEmoji('1387080952190074993').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_increase').setEmoji('1387080984616501329').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_decrease').setEmoji('1387080964819128431').setStyle(ButtonStyle.Secondary),
        );

        await panelChannel.send({
            embeds: [panelEmbed],
            components: [row1, row2],
            files: [path.join(__dirname, '..', 'assets', 'vm-logo.png')],
        });

        const configData = fs.existsSync(configPath)
            ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
            : {};
        configData[guild.id] = {
            generator: generatorChannel.id,
            category: category.id,
            panel: panelChannel.id
        };
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

        if (!fs.existsSync(activeRoomsPath)) {
            fs.writeFileSync(activeRoomsPath, JSON.stringify({}, null, 2));
        }

        message.reply({
            embeds: [{
                color: 0x7ab158,
                description: '✅ VoiceMaster setup completed!',
            }]
        });
    }
};
