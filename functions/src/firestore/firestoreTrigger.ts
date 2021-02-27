import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import algoliaOnCreate from "./trigger/algoliaOnCreate";
import contentModelOnCreate from "./trigger/contentModelOnCreate";


// The Firebase Admin SDK to access Cloud Firestore.
// import * as admin from "firebase-admin";
const reserved_collection = [
  "iris_content_model",
  "iris_role_permission",
  "iris_user",
  "iris_",
  "iris_global",
  "iris_plugin",
];

export default functions.firestore
  .document("/{table_name}/{docId}")
  .onCreate(async (snapshot, context) => {
    // ignore if not prefixed
    if (!context.params.table_name.startsWith("iris_")) {
      return;
    }
    // ignore if its system
    if (reserved_collection.includes(context.params.table_name)) {
      // trigger for content model create
      if(context.params.table_name === 'iris_content_model') await contentModelOnCreate(snapshot, context);
      return;
    }
    // check if algolia index is set
    const db = admin.firestore();
    const cmDoc = db
      .collection("iris_content_model")
      .doc(context.params.table_name);
    const cmData = await cmDoc.get();
    if (!cmData.exists) {
      // do nothing
      return;
    }
    // get secret
    const secretDoc = await admin
      .firestore()
      .collection("iris_global")
      .doc("iris_secret");
    const secretData = await secretDoc.get();
    if (!secretData.exists) {
      throw new HttpsError("internal", "secret not exists. init first!");
    }
    // get settings
    const settingsDoc = await admin
      .firestore()
      .collection("iris_global")
      .doc("iris_settings");
    const settingsData = await settingsDoc.get();
    if (!settingsData.exists) {
      throw new HttpsError("internal", "settings not exists. init first!");
    }
    // algolia trigger
    await algoliaOnCreate(settingsData, cmData, secretData, snapshot);
    // CREATE content model trigger
  });
