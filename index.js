require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.commands = new Collection();
client.prefixCommands = new Collection();

require('./src/core/CommandHandler')(client);
require('./src/events/ready.js')(client);
require('./src/events/interactionCreate.js')(client);
require('./src/events/messageCreate.js')(client);

client.login(process.env.DISCORD_TOKEN);
