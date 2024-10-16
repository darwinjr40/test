const { db } = require('./../firebase.js');

async function saveLog(log) {
    try {
        const logRef = db.collection('logs').doc();
        await logRef.set(log);
        // console.log('Log guardado correctamente en Firestore:', log);
    } catch (error) {
        console.error('Error al guardar el log en Firestore:', error);
    }
}

module.exports = { saveLog };