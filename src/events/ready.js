module.exports = (client) => {
    client.once('ready', () => {
        console.log(`✅ Mira está lista como ${client.user.tag}`);
    });
};
