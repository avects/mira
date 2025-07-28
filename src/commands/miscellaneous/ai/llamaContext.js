const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'llamaContext.json');
let contextMap = new Map();

// 📦 1. Cargar contexto desde archivo al iniciar
function loadContext() {
    if (!fs.existsSync(filePath)) return;

    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(raw);

        contextMap = new Map(Object.entries(json));
    } catch (err) {
        console.error('[LLaMA CONTEXT] Error loading context:', err);
    }
}

// 💾 2. Guardar contexto en archivo
function saveContext() {
    const plainObject = Object.fromEntries(contextMap);
    fs.writeFileSync(filePath, JSON.stringify(plainObject, null, 2));
}

// 📚 3. Obtener historial
function get(channelId) {
    return contextMap.get(channelId) || [];
}

// ➕ 4. Agregar mensaje
function add(channelId, message) {
    const history = get(channelId);
    history.push(message);

    if (history.length > 10) history.shift(); // limita a 10 líneas
    contextMap.set(channelId, history);

    saveContext(); // guarda cada vez que se actualiza
}

// 🧾 5. Formatear para el prompt
function format(channelId) {
    return get(channelId).join('\n');
}

loadContext();

module.exports = { get, add, format };
