module.exports = {
    name: 'ping',
    description: 'Check Mira’s latency 🏓',
    async execute(message, args) {
        const silent = args.includes('--silent');
        const sent = await message.channel.send('Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        if (!silent) {
            sent.edit(`🏓 Pong! Latency is **${latency}ms**`);
        } else {
            sent.delete();
        }
    }
};
