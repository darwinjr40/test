const Collection = require('../colections.js'); // Importar la clase
const { saveLog } = require('./log-saved');
const Status = require('./../status.js');
// const admin = require('firebase-admin');

exports.calendarShiftsMigration = async (sourceCollection, targetCollection, res) => {
  try {
    let log = {};
    let resultMessage = '';
    const startTime = Date.now();


    resultMessage = `Starting the collection migration process ${targetCollection.id}...`;
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
    //   resultMessage = `La colección ${targetCollection.id} ya contiene documentos. Migración abortada.`;
    //   log = {
    //     status: Status.error,
    //     mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
    //     startAt: startTime,
    //     endAt: Date.now(),
    //     detail: resultMessage,
    //   };
    //   await saveLog(log);
    //   console.error(resultMessage);
    //   return res.status(409).send({ message: resultMessage });
    // }
    const BATCH_SIZE = 500;
    let documentCount = 0;
    let totalOperations = 0;

    async function processUserCalendarShifts(userDoc) {
      const user = userDoc.data();
      if (!user.uid) return [];
      const calendarShiftsSnapshot = await sourceCollection.doc(user.uid).collection(Collection.calendarShift).get();
      return calendarShiftsSnapshot.docs
        .map(shiftDoc => ({ ...shiftDoc.data(), userId: user.uid }))
        .filter(shift => shift.id);
    }

    function createCalendarShiftData(map) {
      return {
        userScheduleDataId: map.id,
        scheduleTypeId: map.shiftId,
        appUserId: map.userId,
        date: map?.date ?? new Date(),
        createdAt: map?.createdAt ?? new Date(),
        type: 'calendar_shift'
        // startTime: map?.startTime ?? null,
        // endTime: map?.endTime ?? null,
      };
    }

    async function processBatch(shifts) {
      const batch = targetCollection.firestore.batch();
      let batchCount = 0;

      for (const shift of shifts) {
        if (!shift.userId || !shift.id || !shift.shiftId) continue;
        const newData = createCalendarShiftData(shift);
        batch.set(targetCollection.doc(shift.id), newData);
        batchCount++;
      }

      if (batchCount > 0) {
        await batch.commit();
        documentCount += batchCount;
        totalOperations += batchCount;
        console.log(`Processed ${batchCount} calendarShifts in this batch. Total: ${documentCount}`);
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
    resultMessage = `Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}. Total calendar Shifts migrated: ${documentCount}. Total operations: ${totalOperations}. Total time taken: ${elapsedTime} seconds.`;
    console.log(resultMessage);
    log = {
      status: Status.sucess,
      mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
      startAt: startTime,
      endAt: Date.now(),
      detail: resultMessage,
      detail2: `コレクションの移行プロセスが完了しました ${sourceCollection.id} -> ${targetCollection.id}. 総処理ドキュメント数: ${documentCount}. 総処理時間: ${elapsedTime} 秒.`,

      // detail2: `完全な移行。 ${sourceCollection.id} -> ${targetCollection.id}. 移行されたカレンダー シフトの合計数 ${documentCount}. 合計操作: ${totalOperations}. 合計時間: ${elapsedTime} 秒.`,
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
    console.error('Error durante la migración:', error);
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
      { message: 'La migración falló: ' + error.message }
    );
  }
};
