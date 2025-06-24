const {
    SlashCommandBuilder,
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const embeds = require('../../../../constants/embeds'); // Ajusta el path si es diferente


// ✅ Corrección de ruta al subir un nivel desde /setup/
const configPath = path.join(__dirname, '..', 'config.json');
const activeRoomsPath = path.join(__dirname, '..', 'activeRooms.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voicemaster')
        .setDescription('Setup your VoiceMaster system')
        .addSubcommand(sub =>
            sub.setName('setup')
                .setDescription('Create VoiceMaster category and panel')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const { guild } = interaction;

        // Crear categoría
        const category = await guild.channels.create({
            name: '📞 voice channels',
            type: ChannelType.GuildCategory,
        });

        // Canal generador
        const generatorChannel = await guild.channels.create({
            name: 'create',
            type: ChannelType.GuildVoice,
            parent: category.id,
        });

        // Canal de panel
        const panelChannel = await guild.channels.create({
            name: 'panel',
            type: ChannelType.GuildText,
            parent: category.id,
        });

        // Embed del panel
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
                `➖ — **Decrease** the user limit`
            )
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

        // 🔐 Asegurar existencia de la carpeta y archivos
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });

        const configData = fs.existsSync(configPath)
            ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
            : {};

        configData[guild.id] = {
            generator: generatorChannel.id,
            category: category.id,
            panel: panelChannel.id,
        };

        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

        // Asegurar existencia del archivo activeRooms.json vacío
        if (!fs.existsSync(activeRoomsPath)) {
            fs.writeFileSync(activeRoomsPath, JSON.stringify({}, null, 2));
        }

        await interaction.reply({
            embeds: [embeds.success('VoiceMaster setup completed!')],
            ephemeral: true,
        });
    }
};
