const Collection = require('../colections.js'); // Importar la clase
const { saveLog } = require('./log-saved');
const Status = require('./../status.js');


  // exports.schedulesMigration = async (sourceCollection, targetCollection, res) => {
  //   try {
  //     let resultMessage = '';
  //     const integrationResultsSnap = await targetCollection.limit(1).get();
  //     if (integrationResultsSnap.empty) {
  //       resultMessage = `La colección ${targetCollection.id} no contiene documentos. Migración abortada.`;
  //       console.error(resultMessage);
  //       return res.status(409).send(resultMessage);
  //     }
  
  //     console.log(`Iniciando proceso de migración para la colección ${targetCollection.id}...`);
  //     const startTime = Date.now();
  //     const BATCH_SIZE = 500;
  //     let documentCount = 0;
  //     let totalOperations = 0;
  
  //     async function processUserSchedules(userDoc) {
  //       const user = userDoc.data();
  //       if (!user.uid) return [];
  //       const schedulesSnapshot = await sourceCollection.doc(user.uid).collection(Collection.schedule).get();
  //       return schedulesSnapshot.docs
  //         .map(obj => ({ ...obj.data(), userId: user.uid }))
  //         .filter(obj => obj.id);
  //     }
  
  //     function createSchedules(map) {
  //       const { userId, ...copy } = map;
  //       return {...copy, type:'schedule'};
  //     }
  
  //     async function processBatch(objList) {
  //       const batch = targetCollection.firestore.batch();
  //       let batchCount = 0;
  
  //       for (const data of objList) {
  //         // if (!shift.userId || !shift.id || !shift.shiftId) continue;
  //         const newData = createSchedules(data);
  //         // batch.set(targetCollection.doc(data.userId).collection(Collection.schedule).doc(data.id), newData);
  //         batch.set(targetCollection.doc(data.id), newData);
  //         batchCount++;
  //       }
  
  //       if (batchCount > 0) {
  //         await batch.commit();
  //         documentCount += batchCount;
  //         totalOperations += batchCount;
  //         console.log(`Procesados ${batchCount} turnos en este lote. Total: ${documentCount}`);
  //       }
  //     }
  
  //     const usersSnapshot = await sourceCollection.get();
  //     for (let i = 0; i < usersSnapshot.docs.length; i += BATCH_SIZE) {
  //       const userBatch = usersSnapshot.docs.slice(i, i + BATCH_SIZE);
  //       const userScheduleBatch = await Promise.all(userBatch.map(processUserSchedules));
  //       const userSchedules = userScheduleBatch.flat();
  //       await processBatch(userSchedules);
  //     }
  
  //     const elapsedTime = (Date.now() - startTime) / 1000;
  //     resultMessage = `Migración completada para la colección ${sourceCollection.id} a ${targetCollection.id}. Total de turnos migrados: ${documentCount}. Total de operaciones: ${totalOperations}. Tiempo total: ${elapsedTime} segundos.`;
  //     console.log(resultMessage);
  //     return res.json({
  //       message: resultMessage,
  //       status: 200,
  //       elapsedTime: `${elapsedTime} segundos`,
  //       processedDocuments: documentCount,
  //       totalOperations
  //     });
  //   } catch (error) {
  //     console.error('Error durante la migración:', error);
  //     return res.status(500).send('La migración falló: ' + error.message);
  //   }
  // };


  exports.schedulesMigration = async (sourceCollection, targetCollection, res) => {
    try {
      let log = {};
      let resultMessage = '';
      const startTime = Date.now();
  
  
      resultMessage = `Starting the collection migration process ${sourceCollection.id}...`;
      console.log(resultMessage);
      log = {
        status: Status.starting,
        mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
        startAt: startTime,
        endAt: Date.now(),
        detail: resultMessage,
        detail2: `コレクションの移行プロセスの開始 ${sourceCollection.id}...`,
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
      //   return res.status(404).send({ message: resultMessage });
      // }
      const BATCH_SIZE = 500;
      let documentCount = 0;
      let totalOperations = 0;
  
      async function processUserSchedules(userDoc) {
        const user = userDoc.data();
        if (!user.uid) return [];
        const schedulesSnapshot = await sourceCollection.doc(user.uid).collection(Collection.schedule).get();
        return schedulesSnapshot.docs
          .map(shiftDoc => ({ ...shiftDoc.data(), userId: user.uid }))
          .filter(shift => shift.id);
      }
  
      function createSchedules(schedule) {
        return {
          userScheduleDataId: schedule.id,
          appUserId: schedule.userId,
          startTime: schedule?.startAt ?? null,
          endTime: schedule?.endAt ?? null,
          isAllDay: schedule?.isAllDay ?? false,
          title: schedule?.title ?? '',
          memo: schedule?.memo ?? '',
          url: schedule?.url ?? '',
          type: 'schedule',
        };
      }
  
      async function processBatch(schedules) {
        const batch = targetCollection.firestore.batch();
        let batchCount = 0;
  
        for (const shift of schedules) {
          if (!shift.userId || !shift.id) continue;
          const newData = createSchedules(shift);
          batch.set(targetCollection.doc(shift.id), newData);
          batchCount++;
        }
  
        if (batchCount > 0) {
          await batch.commit();
          documentCount += batchCount;
          totalOperations += batchCount;
          console.log(`Processed ${batchCount} schedules in this batch. Total: ${documentCount}`);
          
        }
      }
  
      const usersSnapshot = await sourceCollection.get();
      for (let i = 0; i < usersSnapshot.docs.length; i += BATCH_SIZE) {
        const userBatch = usersSnapshot.docs.slice(i, i + BATCH_SIZE);
        const schedulesBatch = await Promise.all(userBatch.map(processUserSchedules));
        const schedules = schedulesBatch.flat();
        await processBatch(schedules);
      }
  
      const elapsedTime = (Date.now() - startTime) / 1000;
      resultMessage = `Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}. Total schedules migrated: ${documentCount}. Total operations: ${totalOperations}. Total time taken: ${elapsedTime} seconds.`;
      console.log(resultMessage);
      log = {
        status: Status.sucess,
        mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
        startAt: startTime,
        endAt: Date.now(),
        detail: resultMessage,
        detail2: `コレクションの移行プロセスが完了しました ${sourceCollection.id} -> ${targetCollection.id}. 総処理ドキュメント数: ${documentCount}. 総処理時間: ${elapsedTime} 秒.`,
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
  
  
