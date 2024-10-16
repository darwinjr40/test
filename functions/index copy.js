// const functions = require('firebase-functions');
// const express = require('express');
// const app = express();

// app.use(express.json());

// app.get('/test', async (req, res) => {
//     res.status(201).send('todo bien');
// });

// exports.api = functions
//     .runWith({ timeoutSeconds: 540, memory: '2GB' })
//     .https.onRequest(app);



const Collection = require('./colections.js'); // Importar la clase
const express = require('express');
const { AppUser, ScheduleType, UserScheduleData } = require('./models');
const { schedulesMigration, userAppMigration, shiftsMigration, calendarShiftsMigration } = require('./methods');

const functions = require('firebase-functions');
const { db } = require('./firebase');

const app = express();

app.use(express.json());

app.get('/test', async (req, res) => {
    res.status(201).send(`todo bien`);
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
        const targetCollection = db.collection(Collection.appUser);
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

exports.api = functions.runWith({
    timeoutSeconds: 540, // 9 minutos
    memory: '2GB' // Opcional: aumentar la memoria si es necesario
}).https.onRequest(app);



// const functions = require('firebase-functions');
// const { db } = require('./firebase.js');
// const { schedulesMigration, userAppMigration, shiftsMigration, calendarShiftsMigration } = require('./methods/index.js');
// const Collection = require('./colections.js');

// exports.appUsers = functions.runWith({
//     timeoutSeconds: 540, // 9 minutos
//     memory: '2GB'
// }).https.onRequest(async (req, res) => {
//     try {
//         const sourceCollection = db.collection(Collection.user);
//         const targetCollection = db.collection(Collection.appUser);
//         await userAppMigration(sourceCollection, targetCollection, rzes);
//     } catch (error) {
//         console.error('Error en app-users:', error);
//         res.status(500).send('Error en la migración de usuarios');
//     }
// });

// exports.schedules = functions.runWith({
//     timeoutSeconds: 540,
//     memory: '2GB'
// }).https.onRequest(async (req, res) => {
//     try {
//         const sourceCollection = db.collection(Collection.user);
//         const targetCollection = db.collection(Collection.appUser);
//         await schedulesMigration(sourceCollection, targetCollection, res);
//     } catch (error) {
//         console.error('Error en schedules:', error);
//         res.status(500).send('Error en la migración de horarios');
//     }
// });

// exports.shifts = functions.runWith({
//     timeoutSeconds: 540,
//     memory: '2GB'
// }).https.onRequest(async (req, res) => {
//     try {
//         const sourceCollection = db.collection(Collection.user);
//         const targetCollection = db.collection(Collection.scheduleType);
//         await shiftsMigration(sourceCollection, targetCollection, res);
//     } catch (error) {
//         console.error('Error en shifts:', error);
//         res.status(500).send('Error en la migración de turnos');
//     }
// });

// exports.calendarShifts = functions.runWith({
//     timeoutSeconds: 540,
//     memory: '2GB'
// }).https.onRequest(async (req, res) => {
//     try {
//         const sourceCollection = db.collection(Collection.user);
//         const targetCollection = db.collection(Collection.userScheduleData);
//         await calendarShiftsMigration(sourceCollection, targetCollection, res);
//     } catch (error) {
//         console.error('Error en calendar-shifts:', error);
//         res.status(500).send('Error en la migración de turnos de calendario');
//     }
// });

// exports.test = functions.https.onRequest((req, res) => {
//     const number = Math.round(Math.random() * 100);  
//     res.status(201).send(number.toString());
//     // res.status(201).send('todo bien');
// });
