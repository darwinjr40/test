
const { AppUser, ScheduleType, UserScheduleData } = require('../models');
const { saveLog } = require('./log-saved');
const Status = require('./../status.js');

const userAppMigration = async (sourceCollection, targetCollection, res) => {
    try {
        const startTime = Date.now();
        let resultMessage = '';
        let log = {};

        resultMessage = `Starting migration process for collection ${sourceCollection.id} -> ${targetCollection.id}...`;
        console.log(resultMessage);
        log = {
            status: Status.starting,
            mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
            startAt: startTime,
            endAt: Date.now(),
            detail: resultMessage,
            detail2: `コレクションの移行プロセスの開始 ${sourceCollection.id} -> ${targetCollection.id}...`,
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
        const snap = await sourceCollection.get();

        if (snap.empty) {
            resultMessage = `The collection ${sourceCollection.id} is empty.`;
            log = {
                status: Status.error,
                mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
                startAt: startTime,
                endAt: Date.now(),
                detail: resultMessage,
                detail2: `コレクション: ${sourceCollection.id} は空です。`,
            };
            await saveLog(log);
            console.error(resultMessage);
            return res.status(204).json({ message: resultMessage });
        }
        resultMessage = `Found ${snap.size} documents in ${sourceCollection.id}. Starting migration...`;
        console.log(resultMessage);

        // log = {
        //     status: Status.processing,
        //     mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
        //     startAt: startTime,
        //     endAt: Date.now(),
        //     detail: logMessage,
        // };
        // await saveLog(log);

        let batch = sourceCollection.firestore.batch();
        let operationCount = 0;
        let documentCount = 0;
        const BATCH_LIMIT = 500;

        for (const doc of snap.docs) {
            const data = doc.data();
            if (!data.uid) continue;
            let user = AppUser.fromMap(data).toAppUser();

            const userDocRef = targetCollection.doc(user.appUserId);
            batch.set(userDocRef, user);
            operationCount++;
            documentCount++;
            if (operationCount >= BATCH_LIMIT) {
                await batch.commit();
                console.log(`Committed batch with ${operationCount} operations.`);
                batch = sourceCollection.firestore.batch();
                operationCount = 0;
            }
        }
        if (operationCount > 0) {
            await batch.commit();
            console.log(`Committed final batch with ${operationCount} operations.`);
        }
        const elapsedTime = (Date.now() - startTime) / 1000;
        resultMessage = `Migration completed for collection ${sourceCollection.id} to ${targetCollection.id}. Total documents processed: ${snap.size}. Total individual documents created: ${documentCount}. Total time taken: ${elapsedTime} seconds.`;
        console.log(resultMessage);
        log = {
            status: Status.sucess,
            mapping: `${sourceCollection.id} -> ${targetCollection.id}`,
            startAt: startTime,
            endAt: Date.now(),
            detail: resultMessage,
            detail2: `コレクションの移行プロセスが完了しました ${sourceCollection.id} -> ${targetCollection.id}. 総処理ドキュメント数: ${snap.size}. 個別ドキュメント作成数: ${documentCount}. 総処理時間: ${elapsedTime} 秒.`,
        };
        await saveLog(log);
        return res.status(200).json({
            message: resultMessage,
            status: 200,
            elapsedTime: `${elapsedTime} seconds`,
            processedDocuments: documentCount
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

        return res.status(500).json({ message: error });
    }
};

module.exports = { userAppMigration };