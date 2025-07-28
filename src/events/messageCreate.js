const prefix = '!'; // temporal
const askLlama = require('../utils/askLlama');
const ctx = require('../commands/miscellaneous/ai/llamaContext');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        // --- 🔹 RESPUESTAS .LLAMA ---
        if (message.content.startsWith('.')) {
            const userInput = message.content.slice(1).trim();
            const channelId = message.channel.id;

            const basePrompt = `Eres una chica llamada Mira, tierna pero sarcástica, y estás chateando en Discord con un grupo de humanos. Sé divertida y útil.`;
            const contextText = ctx.format(channelId);
            const fullPrompt = `${basePrompt}\n${contextText}\nUsuario: ${userInput}\nMira:`;

            ctx.add(channelId, `Usuario: ${userInput}`);

            try {
                const reply = await askLlama(fullPrompt);
                ctx.add(channelId, `Mira: ${reply}`);
                await message.reply(reply.slice(0, 2000));
            } catch (err) {
                console.error('[LLaMA error]', err);
                await message.reply('❌ No pude responder eso ahora.');
            }

            return; // evita que también intente ejecutarlo como comando prefix
        }

        // --- 🔹 COMANDOS PREFIX (!) ---
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        const command = client.prefixCommands.get(cmd);
        if (!command) return;

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            await message.reply('❌ Error executing command');
        }
    });
};
