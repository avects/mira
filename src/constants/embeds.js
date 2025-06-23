const { EmbedBuilder } = require('discord.js');

module.exports = {
    success: (message) =>
        new EmbedBuilder()
            .setColor('#7ab158')
            .setDescription(`✅ ${message}`),

    error: (message) =>
        new EmbedBuilder()
            .setColor('#a82d43')
            .setDescription(`❌ ${message}`),

    info: (message) =>
        new EmbedBuilder()
            .setColor('#3c3b40')
            .setDescription(`ℹ️ ${message}`),

    warn: (message) =>
        new EmbedBuilder()
            .setColor('#dca60d')
            .setDescription(`⚠️ ${message}`),
};
