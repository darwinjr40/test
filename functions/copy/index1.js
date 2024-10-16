
const Collection = require('../colections.js'); // Importar la clase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const AppUser = require('../models/app-user.js');
admin.initializeApp();
const db = admin.firestore();


async function addDocument(collectionName, data) {
    try {
        const docRef = await db.collection(collectionName).add(data);
        console.log(`Documento agregado a ${collectionName} con ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        throw new Error("Error al agregar el documento: " + error);
    }
}

const app = express();

app.use(express.json());

app.post('/create', async (req, res) => {
    const data = req.body;
    try {
        const docRef = await db.collection(Collection.appUser).add(data);
        res.status(201).send(`Objeto creado con ID: ${docRef.id}`);
    } catch (error) {
        console.error('Error al crear el objeto:', error);
        res.status(500).send('Error al crear el objeto.');
    }
});

app.post('/loco', async (req, res) => {
    const data = req.body;
    res.status(201).send(`Objeto creado con ID: ${data}`);
});

app.post('/random', async (req, res) => {
    try {
        const { count } = req.body;
        // const batch = db.batch();
        for (let i = 0; i < count; i++) {
            const randomUser = AppUser.createAppUser();
            await addDocument(Collection.appUser, randomUser.toJson());
            // const userRef = db.collection(Collection.AppUsers).doc();
            // batch.set(userRef, randomUser.toJson());
        }
        // await batch.commit();
        res.status(201).json({ message: `${count} random users created successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exportar la aplicación de Express como una función de Firebase
exports.api = functions.https.onRequest(app);

