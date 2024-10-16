const Collection = require('../colections.js'); // Importar la clase
const { saveLog } = require('./log-saved');
const Status = require('./../status.js');
// const admin = require('firebase-admin');

exports.shiftsMigration = async (sourceCollection, targetCollection, res) => {
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

    async function processUserShifts(userDoc) {
      const user = userDoc.data();
      if (!user.uid) return [];
      const shiftsSnapshot = await sourceCollection.doc(user.uid).collection(Collection.shift).get();
      return shiftsSnapshot.docs
        .map(shiftDoc => ({ ...shiftDoc.data(), userId: user.uid }))
        .filter(shift => shift.id);
    }

    function createShiftData(shift) {
      return {
        userId: shift.userId,
        scheduleTypesId: shift.id,
        name: shift?.name ?? '',
        color: shift?.color ?? '',
        isEditable: shift?.isEditable ?? true,
        isActive: shift?.isActive ?? false,
        isSystemDefault: !(shift?.isEditable ?? true),
        createdAt: shift?.createdAt ?? new Date(),
        startTime: shift?.startTime ?? null,
        endTime: shift?.endTime ?? null,
      };
    }

    async function processBatch(shifts) {
      const batch = targetCollection.firestore.batch();
      let batchCount = 0;

      for (const shift of shifts) {
        if (!shift.userId || !shift.id) continue;
        const newData = createShiftData(shift);
        batch.set(targetCollection.doc(shift.id), newData);
        batchCount++;
      }

      if (batchCount > 0) {
        await batch.commit();
        documentCount += batchCount;
        totalOperations += batchCount;
        console.log(`Processed ${batchCount} shifts in this batch. Total: ${documentCount}`);
        
      }
    }

    const usersSnapshot = await sourceCollection.get();
    for (let i = 0; i < usersSnapshot.docs.length; i += BATCH_SIZE) {
      const userBatch = usersSnapshot.docs.slice(i, i + BATCH_SIZE);
      const shiftsBatch = await Promise.all(userBatch.map(processUserShifts));
      const shifts = shiftsBatch.flat();
      await processBatch(shifts);
    }

    const elapsedTime = (Date.now() - startTime) / 1000;
    resultMessage = `Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}. Total shifts migrated: ${documentCount}. Total operations: ${totalOperations}. Total time taken: ${elapsedTime} seconds.`;
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



//----------------------------------------------------------------------------
// exports.shiftsMigration = async (sourceCollection, targetCollection, res) => {
//   try {
//     let resultMessage = '';
//     const integrationResultsSnap = await targetCollection.limit(1).get();

//     if (!integrationResultsSnap.empty) {
//       resultMessage = `The collection ${targetCollection.id} already contains documents. Migration aborted.`;
//       console.error(resultMessage);
//       return res.status(409).send(resultMessage);
//     }
//     console.log(`Starting migration process for collection ${sourceCollection.id}...`);
//     const startTime = Date.now();

//     const BATCH_SIZE = 500; // Número de operaciones a procesar en cada lote
//     let documentCount = 0;
//     let totalOperations = 0;

//     // Función para procesar los shifts de un usuario
//     async function processUserShifts(userDoc) {
//       const user = userDoc.data();
//       if (!user.uid) return [];
//       const shiftsSnapshot = await sourceCollection.doc(user.uid).collection('shifts').get();
//       return shiftsSnapshot.docs.map(shiftDoc => ({
//         ...shiftDoc.data(),
//         userId: user.uid
//       })).filter(shift => shift.id); // Filtra shifts sin ID
//     }

//     // Función para migrar un shift
//     async function migrateShift(shift) {
//       if(!shift.userId || !shift.id) return 0;
//       const newData = {
//         userId: shift.userId,
//         id: shift.id,
//         name: shift?.name ?? '',
//         color: shift?.color ?? '',
//         isEditable: shift?.isEditable ?? true,
//         isActive: shift?.isActive ?? false,
//         isSystemDefault: !(shift?.isEditable ?? false ),
//         createdAt: shift?.createdAt ?? new Date(),
//         startTime: shift?.startTime ?? null,
//         endTime: shift?.endTime ?? null,
//         isSystemDefault: !(shift?.isEditable ?? true),
//       };
//       await targetCollection.doc(shift.id).set(newData);
//       return 1; // Indica que se procesó un documentonewData
//     }

//     // Función para procesar un lote de shifts
//     async function processBatch(shifts) {
//       const results = await Promise.all(shifts.map(migrateShift));
//       const processedCount = results.reduce((sum, count) => sum + count, 0);
//       documentCount += processedCount;
//       totalOperations += processedCount;
//       console.log(`Processed ${processedCount} shifts in this batch. Total: ${documentCount}`);
//     }

//     // Obtener todos los documentos de usuario
//     const usersSnapshot = await sourceCollection.get();

//     // Procesar usuarios en lotes
//     for (let i = 0; i < usersSnapshot.docs.length; i += BATCH_SIZE) {
//       const userBatch = usersSnapshot.docs.slice(i, i + BATCH_SIZE);
//       const shiftsBatch = await Promise.all(userBatch.map(processUserShifts));
//       const shifts = shiftsBatch.flat();
//       await processBatch(shifts);
//     }

//     const elapsedTime = (Date.now() - startTime) / 1000;
//     resultMessage = `
//       Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}.
//       Total shifts migrated: ${documentCount}.
//       Total operations: ${totalOperations}.
//       Total time taken: ${elapsedTime} seconds.
//     `;
//     console.log(resultMessage);
//     return res.json({
//       message: resultMessage,
//       status: 200,
//       elapsedTime: `${elapsedTime} seconds`,
//       processedDocuments: documentCount,
//       totalOperations
//     });
//   } catch (error) {
//     console.error('Error during migration:', error);
//     return res.status(500).send('Migration failed: ' + error.message);
//   }
// };

//----------------------------------------------------------------------------
// const shiftsMigration = async (sourceCollection, targetCollection, res) => {
//   try {
//     const integrationResultsSnap = await targetCollection.limit(1).get();
//     let resultMessage = '';

//     if (!integrationResultsSnap.empty) {
//       resultMessage = `The collection ${targetCollection.id} already contains documents. Migration aborted.`;
//       console.error(resultMessage);
//       return res.status(409).send(resultMessage);
//     }

//     console.log(`Starting migration process for collection ${sourceCollection.id}...`);
//     const startTime = Date.now();

//     const snap = await sourceCollection.get();

//     if (snap.empty) {
//       resultMessage = `The collection ${sourceCollection.id} is empty.`;
//       console.error(resultMessage);
//       return res.status(204).send(resultMessage);
//     }

//     console.log(`Found ${snap.size} documents in ${sourceCollection.id}. Starting migration...`);

//     let documentCount = 0;

//     // Procesar usuarios y sus shifts en paralelo
//     await Promise.all(
//       snap.docs.map(async (doc) => {
//         const user = doc.data();
//         if (!user.uid) return;

//         const shiftsSnap = await sourceCollection.doc(user.uid).collection(Collection.shift).get();
//         documentCount += shiftsSnap.docs.length;
//       })
//     );

//     const elapsedTime = (Date.now() - startTime) / 1000;
//     resultMessage = `
//         Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}.
//         Total users processed: ${snap.size}.
//         Total shifts processed: ${documentCount}.
//         Total time taken: ${elapsedTime} seconds.
//       `;
//     console.log(resultMessage);

//     return res.json({
//       message: resultMessage,
//       status: 200,
//       elapsedTime: `${elapsedTime} seconds`,
//       processedDocuments: documentCount,
//     });
//   } catch (error) {
//     console.error('Error during migration:', error);
//     return res.status(500).send('Migration failed.');
//   }
// };
