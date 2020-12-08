import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Cloud Firestore.
// import * as admin from "firebase-admin";

export default functions.https.onCall(async (data, context) => {
 return 'pong';
})