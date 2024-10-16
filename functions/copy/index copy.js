/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.welcomeuser = functions.auth.user().onCreate(async (user) => {
    return new Promise((resolve, reject) => {
        console.log(`Bienvenido ${user.mail}`);
        resolve(true);
    });
});
exports.deleteuser = functions.auth.user().onDelete(async (user) => {
    return new Promise((resolve, reject) => {
        console.log(`Te fuiste ${user.mail}`);
        resolve(true);
    });
});


// Función para calcular la factura
exports.calculateInvoice = functions.firestore
    .document("invoices/{invoiceid}")
    .onCreate(async (snap, context) => {
        try {
            const invoiceId = context.params.invoiceid;
            const total = snap.data().total;
            const taxes = snap.data().taxes;
            if (typeof total !== 'number' || typeof taxes !== 'number') {
                throw new Error("Invalid data: total and taxes must be numbers");
            }
            // Calcular el total de la factura
            const totalInvoice = total + taxes;

            const firestore = admin.firestore();

            // Guardar el total de la factura en el documento
            await firestore.doc(`invoices/${invoiceId}`).set({
                totalInvoice: totalInvoice,
            }, { merge: true });
            console.log(`Factura ${invoiceId} actualizada con el total: ${totalInvoice}`);
        } catch (error) {
            console.error("Error actualizando la factura:", error);
        }
    });

// Función para calcular la factura
exports.updateinvoice = functions.firestore
    .document("invoices/{invoiceid}")
    .onUpdate((change, context) => {
        try {
            const newValue = change.after.data();
            const previousValue = change.before.data();
            console.log(previousValue);

            const total = newValue.total;
            const taxes = newValue.taxes;
            const totalInvoice = total + taxes;

            return change.after.ref.update({
                totalInvoice: totalInvoice,
            });
        } catch (error) {
            console.error("Error actualizando la factura:", error);
        }
    });


exports.deteteinvoice = functions.firestore
    .document("invoices/{invoiceid}")
    .onCreate(async (snap, context) => {
        try {
            console.log("invoice eliminada");
            console.log(snap);

        } catch (error) {
            console.error("Error deteteinvoice");

        }
    });

exports.modifyinvoice = functions.firestore
    .document("invoices/{invoiceid}")
    .onWrite(async (change, context) => {
        try {
            const invoiceAfter = change.after.exists ? change.after.data() : nult;
            const invoicePrevious = change.before.exists ? change.before.data() : null;
            if (invoiceAfter == null) {
                console.log("documento eliminado");
            }
            if (invoiceAfter != null && invoicePrevious == null) {
                console.log("Creando el invoice");
            }

            console.log("invoice eliminada");
            console.log(snap);

        } catch (error) {
            console.error("Error modifyinvoice");

        }
    });

