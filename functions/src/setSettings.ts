import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import isRole from "./helper/isRole";
import simpleAuth from "./helper/simpleAuth";
import * as admin from 'firebase-admin';
import { encrypt } from "./helper/crypt";

// The Firebase Admin SDK to access Cloud Firestore.
// import * as admin from "firebase-admin";
const schema = {
  properties: {
    algolia: {
      required: ['app_id', 'app_secret'],
      properties: {
        app_id: { type: "string" },
        app_secret: { type: "string" },
        app_search_secret: { type: "string" },
      },
    },
  },
};
export default functions.https.onCall(async (data, context) => {
  simpleAuth(data, context, schema);
  // check if user is super_admin
  if (!await isRole(context.auth ? context.auth.uid : '', 'super_admin')) {
    throw new HttpsError('permission-denied', 'must be superadmin role');
  }
  // first get secret key
  const doc = admin.firestore().collection('iris_global').doc('iris_settings');
  const secretDoc = await admin.firestore().collection('iris_global').doc('iris_secret');
  const secretData = await secretDoc.get();
  const settings = await doc.get();
  if (!settings.exists) {
    throw new HttpsError("internal", "settings not exists. init first!");
  }
  if (!secretData.exists) {
    throw new HttpsError("internal", "secret not exists. init first!");
  }
  const secret = secretData?.data()?.secret;
  
  if (typeof data.algolia === 'object') {
    // encrypt required data.
    data.algolia.app_secret = encrypt(data.algolia.app_secret, secret);
  }
  await doc.update(data);
  
  return {
    code: 'ok',
    message: 'settings is set.',
  };
});
