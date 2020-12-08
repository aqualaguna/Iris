import * as functions from "firebase-functions";

// The Firebase Admin SDK to access Cloud Firestore.
// import * as admin from "firebase-admin";
const IRIS_FUNCTION_VERSION = '1.0.0';

export default functions.https.onCall(async (data, context) => {
 return IRIS_FUNCTION_VERSION;
})