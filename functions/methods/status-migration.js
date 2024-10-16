const Collection = require('../colections.js'); // Importar la clase
const { db } = require('./../firebase.js');

exports.statusMigration = async (res) => {
    try {
        const usersSnap = await db.collection(Collection.appUser).limit(1).get();
        const shiftsSnap = await db.collection(Collection.scheduleType).limit(1).get();
        const calendar_shiftsSnap = await db.collection(Collection.userScheduleData).get();
        const friendsSnap = await db.collection(Collection.userFriendShip).limit(1).get();
        // const schedulesSnap = await db.collection(Collection.userScheduleData).limit(1).get();
        // const dataList = calendar_shiftsSnap.docs.find(doc => doc.data());
        const calendar_shifts = calendar_shiftsSnap.docs.some(doc => doc.data().type === ('calendar_shift'));
        // const calendar_shifts = calendar_shiftsSnap.docs.some(doc => !(doc.data().calendar_shift)) ? true : false;
        const schedules = calendar_shiftsSnap.docs.some(doc => doc.data().type === ('schedule'));

        let resultMessage = '';
        return res.json({
            message: resultMessage,
            status: 200,
            users: !usersSnap.empty,
            shifts: !shiftsSnap.empty,
            calendar_shifts: calendar_shifts,
            friends: !friendsSnap.empty,
            schedules: schedules,
        });
    } catch (error) {
        console.error('Error during migration:', error);
        return res.status(500).send({ message: error });
    }
};