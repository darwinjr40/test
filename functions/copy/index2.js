
const Collection = require('./colections.js'); // Importar la clase
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const { AppUser, ScheduleType, UserScheduleData } = require('./models');
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

// app.post('/create', async (req, res) => {
//     const data = req.body;
//     try {
//         const docRef = await db.collection(Collection.appUser).add(data);
//         res.status(201).send(`Objeto creado con ID: ${docRef.id}`);
//     } catch (error) {
//         console.error('Error al crear el objeto:', error);
//         res.status(500).send('Error al crear el objeto.');
//     }
// });

app.post('/post', async (req, res) => {
    const data = req.body;
    res.status(201).send(`Objeto creado con ID: ${data}`);
});
app.get('/test', async (req, res) => {
    res.status(201).send(`todo bien`);
});

// app.post('/seed/app-user', async (req, res) => {
//     try {
//         const { count } = req.body;
//         // const batch = db.batch();
//         for (let i = 0; i < count; i++) {
//             const randomUser = AppUser.createAppUser();
//             await addDocument(Collection.appUser, randomUser.toJson());
//             // const userRef = db.collection(Collection.AppUsers).doc();
//             // batch.set(userRef, randomUser.toJson());
//         }
//         // await batch.commit();
//         res.status(201).json({ message: `${count} random users created successfully` });
//     } catch (error) {
//         res.status(500).json({ error: error.message });



//     }
// });
//----------------------------------------
async function seedScheduleType(count = 5) {
    for (let i = 0; i < count; i++) {
        await addDocument(Collection.scheduleType, ScheduleType.generateRandom());
    }
}
// app.post('/seed/schedule-type', async (req, res) => {
//     const { count = 5 } = req.body;
//     try {
//         await seedScheduleType(count);
//         res.send('Seeding de scheduleType completado exitosamente');
//     } catch (error) {
//         console.error('Error durante el seeding de scheduleType:', error);
//         res.status(500).send('Error durante el seeding de scheduleType');
//     }
// });
//----------------------------------------
async function seedUserScheduleData(count = 5) {
    for (let i = 0; i < count; i++) {
        await addDocument(Collection.userScheduleData, UserScheduleData.generateRandom());
    }
}
// app.post('/seed/user-schedule-type', async (req, res) => {
//     const { count = 5 } = req.body;
//     try {
//         await seedUserScheduleData(count);
//         res.send('Seeding de scheduleType completado exitosamente');
//     } catch (error) {
//         console.error('Error durante el seeding de userScheduleType:', error);
//         res.status(500).send('Error durante el seeding de userScheduleType');
//     }
// });
//----------------------------------------
// async function seedMainCollection() {
//     const mainData = [
//         { name: 'Categoría 1', description: 'Descripción de la categoría 1' },
//         { name: 'Categoría 2', description: 'Descripción de la categoría 2' },
//     ];

//     for (const data of mainData) {
//         await addDocument('categories', data);
//     }
// }

// Ruta para ejecutar el seeder de categorías
// app.get('/seed/categories', async (req, res) => {
//     try {
//         await seedMainCollection();
//         res.send('Seeding de categorías completado exitosamente');
//     } catch (error) {
//         console.error('Error durante el seeding de categorías:', error);
//         res.status(500).send('Error durante el seeding de categorías');
//     }
// });

// //----------------------------------------
// // Seeder para la colección secundaria (muchos)
// async function seedSecondaryCollection() {
//     const categories = await db.collection('categories').get();
//     for (const category of categories.docs) {
//         const categoryId = category.id;
//         const items = [
//             { name: `Item 1 de ${category.data().name}`, categoryId },
//             { name: `Item 2 de ${category.data().name}`, categoryId },
//             { name: `Item 3 de ${category.data().name}`, categoryId },
//         ];

//         for (const item of items) {
//             await addDocument('items', item);
//         }
//     }
// }

// // Ruta para ejecutar el seeder de items
// app.get('/seed/items', async (req, res) => {
//     try {
//         await seedSecondaryCollection();
//         res.send('Seeding de items completado exitosamente');
//     } catch (error) {
//         console.error('Error durante el seeding de items:', error);
//         res.status(500).send('Error durante el seeding de items');
//     }
// });
// Exportar la aplicación de Express como una función de Firebase
exports.api = functions.https.onRequest(app);

