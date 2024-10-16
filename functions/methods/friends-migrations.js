const Collection = require('../colections.js'); // Importar la clase
const { saveLog } = require('./log-saved');
const Status = require('./../status.js');

exports.friendsMigration = async (sourceCollection, targetCollection, res) => {
    try {
        let log = {};
        let resultMessage = '';
        const startTime = Date.now();


        resuktMessage = `Starting the collection migration process ${targetCollection.id}...`;
        console.log(resultMessage);
        log = {
            status: Status.starting,
            mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
            startAt: startTime,
            endAt: Date.now(),
            detail: resultMessage,
            detail2: `コレクションの移行プロセスの開始 ${targetCollection.id}...`,
        };
        await saveLog(log);

        const integrationResultsSnap = await targetCollection.get();
        console.log(integrationResultsSnap.size);


        // const integrationResultsSnap = await targetCollection.limit(1).get();
        // if (!integrationResultsSnap.empty) {
        //     resultMessage = `The collection ${targetCollection.id} already contains documents. Migration aborted.`;
        //     console.error(resultMessage);
        //     log = {
        //         status: Status.error,
        //         mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
        //         startAt: startTime,
        //         endAt: Date.now(),
        //         detail: resultMessage,
        //     };
        //     await saveLog(log);
        //     return res.status(404).json({ message: resultMessage });
        // }
        const BATCH_SIZE = 500;
        let documentCount = 0;
        let totalOperations = 0;

        async function processUserCalendarShifts(userDoc) {
            const user = userDoc.data();
            if (!user.uid) return [];
            const calendarShiftsSnapshot = await sourceCollection.doc(user.uid).collection(Collection.friend).get();
            return calendarShiftsSnapshot.docs
                .map(shiftDoc => ({ ...shiftDoc.data(), userId: user.uid }))
                .filter(shift => shift.uid);
        }

        function createCalendarShiftData(map) {
            const userId = map.userId;
            const friendId = map.uid;
            const lowerId = userId < friendId ? userId : friendId;
            const higherId = userId < friendId ? friendId : userId;
            return {
                userFriendShipsId: `${lowerId}_${higherId}`,
                requestUserId: map.userId,
                recipientUserId: map.uid,
                friendshipStatusId: '74d0ce58-6902-498f-ab7f-8cd0ca554258',
                createdAt: map?.createdAt ?? new Date(),
                updatedAt: map?.createdAt ?? new Date(),
            };
        }

        async function processBatch(shifts) {
            const batch = targetCollection.firestore.batch();
            let batchCount = 0;

            for (const shift of shifts) {
                if (!shift.userId || !shift.uid) continue;
                const newData = createCalendarShiftData(shift);
                batch.set(targetCollection.doc(newData.userFriendShipsId), newData);
                batchCount++;
            }

            if (batchCount > 0) {
                await batch.commit();
                documentCount += batchCount;
                totalOperations += batchCount;
                console.log(`Processed ${batchCount} friends in this batch. Total: ${documentCount}`);

            }
        }

        const usersSnapshot = await sourceCollection.get();
        for (let i = 0; i < usersSnapshot.docs.length; i += BATCH_SIZE) {
            const userBatch = usersSnapshot.docs.slice(i, i + BATCH_SIZE);
            const shiftsBatch = await Promise.all(userBatch.map(processUserCalendarShifts));
            const shifts = shiftsBatch.flat();
            await processBatch(shifts);
        }

        const elapsedTime = (Date.now() - startTime) / 1000;
        resultMessage = `Migration completed for the collection ${sourceCollection.id} to ${targetCollection.id}. Total friends migrated: ${documentCount}. Total operations: ${totalOperations}. Total time: ${elapsedTime} seconds.`;
        console.log(resultMessage);
        log = {
            status: Status.sucess,
            mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
            startAt: startTime,
            endAt: Date.now(),
            detail: resultMessage,
            detail2: `完全な移行。 ${sourceCollection.id} -> ${targetCollection.id}. 移行した友達の総数 ${documentCount}. 合計操作: ${totalOperations}. 合計時間: ${elapsedTime} 秒.`,
        };
        await saveLog(log);
        return res.json({
            message: resultMessage,
            status: 200,
            elapsedTime: `${elapsedTime} segundos`,
            processedDocuments: documentCount,
            totalOperations
        });
    } catch (error) {
        console.error('Error during migration:', error); 
        log = {
            status: Status.error,
            mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
            startAt: startTime,
            endAt: Date.now(),
            detail: error,
            detail2: error,
        };
        await saveLog(log);
        return res.status(500).send(
            { message: error.message }
        );
    }
};