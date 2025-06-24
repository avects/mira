const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const embeds = require('../../../../constants/embeds');

const configPath = path.join(__dirname, '..', 'data', 'config.json');
const activeRoomsPath = path.join(__dirname, '..', 'data', 'activeRooms.json');

module.exports = {
    name: 'voicemaster',
    aliases: [],
    permissions: [PermissionFlagsBits.Administrator],
    async execute(message, args) {
        if (!args[0] || args[0].toLowerCase() !== 'setup') {
            return message.reply({ embeds: [embeds.info('Usage: `voicemaster setup`')] });
        }

        const { guild } = message;

        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ embeds: [embeds.error('You need Administrator permissions to use this command.')] });
        }

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
            .setTitle('🎛️ VoiceMaster Interface')
            .setDescription(`Use the buttons below to control your voice channel.\n\n**Button Usage**\n` +
                `🔒 — **Lock** the voice channel\n` +
                `🔓 — **Unlock** the voice channel\n` +
                `👻 — **Ghost** the voice channel\n` +
                `🌐 — **Reveal** the voice channel\n` +
                `🎙️ — **Claim** the voice channel\n` +
                `⛔ — **Disconnect** a member\n` +
                `🎮 — **Start** an activity\n` +
                `ℹ️ — **View** channel information\n` +
                `➕ — **Increase** the user limit\n` +
                `➖ — **Decrease** the user limit`)
            .setColor('#5865F2')
            .setFooter({ text: 'VoiceMaster by Mira' });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vm_lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_unlock').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_ghost').setEmoji('👻').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_reveal').setEmoji('🌐').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_claim').setEmoji('🎙️').setStyle(ButtonStyle.Secondary),
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('vm_disconnect').setEmoji('⛔').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_activity').setEmoji('🎮').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_info').setEmoji('ℹ️').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_increase').setEmoji('➕').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('vm_decrease').setEmoji('➖').setStyle(ButtonStyle.Secondary),
        );

        await panelChannel.send({ embeds: [panelEmbed], components: [row1, row2] });

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

        return message.reply({ embeds: [embeds.success('VoiceMaster setup completed!')] });
    },
};
