const axios = require('axios');

async function askLlama(prompt) {
    const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3:latest',
        prompt,
        stream: false
    });

    return res.data.response;
}

module.exports = askLlama;
