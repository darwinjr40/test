
const Collection = require('./colections.js'); // Importar la clase
const express = require('express');
const { AppUser, ScheduleType, UserScheduleData } = require('./models');
const { schedulesMigration, userAppMigration, shiftsMigration, calendarShiftsMigration, friendsMigration, statusMigration } = require('./methods');

const functions = require('firebase-functions');
const { db } = require('./firebase');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({ origin: true }));

app.get('/test', async (req, res) => {
    res.status(201).send(`todo bien`);
});

app.get('/collection', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({
          message: "Falta el parámetro 'name'",
          status: 400
        });
    }  
    const usersSnap = await db.collection(name).limit(1).get();

    return res.json({
        status: 200,
        collection: name,
        existsData:!usersSnap.empty,
      });
});


app.get('/app-users', async (req, res) => {
    try {
        const sourceCollection = db.collection(Collection.user);
        const targetCollection = db.collection(Collection.appUser);
        return await userAppMigration(sourceCollection, targetCollection, res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});

app.get('/schedules', async (req, res) => {
    try {
        const sourceCollection = db.collection(Collection.user);
        const targetCollection = db.collection(Collection.userScheduleData);
        return await schedulesMigration(sourceCollection, targetCollection, res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});

app.get('/shifts', async (req, res) => {
    try {
        const sourceCollection = db.collection(Collection.user);
        const targetCollection = db.collection(Collection.scheduleType);
        return await shiftsMigration(sourceCollection, targetCollection, res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});
app.get('/calendar-shifts', async (req, res) => {
    try {
        const sourceCollection = db.collection(Collection.user);
        const targetCollection = db.collection(Collection.userScheduleData);
        return await calendarShiftsMigration(sourceCollection, targetCollection, res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});
app.get('/friends', async (req, res) => {
    try {
        const sourceCollection = db.collection(Collection.user);
        const targetCollection = db.collection(Collection.userFriendShip);
        return await friendsMigration(sourceCollection, targetCollection, res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});
app.get('/migration-status', async (req, res) => {
    try {
        return await statusMigration(res);
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});
app.get('/logs', async (req, res) => {
    try {
        const integrationResultsSnap = await db.collection(Collection.logs).get();
        const dataList = integrationResultsSnap.docs.map(doc => {
            const data = doc.data();
            return data;
        }
        );
        return res.status(200).send({
            message: 'Data retrieved successfully',
            data: dataList,
        });
    } catch (error) {
        console.error('Error al leer el documento:', error);
    }
});

exports.api = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB'
}).https.onRequest(app);
