import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { decrypt } from "./helper/crypt";
import algoliasearch from "algoliasearch";

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
  .document("/iris_{table_name}/{docId}")
  .onWrite(async (snapshot, context) => {
    // ignore if its system
    if (reserved_collection.includes("iris_" + context.params.table_name)) {
      // do nothing
      return;
    }
    // check if algolia index is set
    const db = admin.firestore();
    const cmDoc = db
      .collection("iris_content_model")
      .doc("iris_" + context.params.table_name);
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
    const algolia = settingsData.data()?.algolia;
    if (
      typeof algolia === "object" &&
      algolia.app_id &&
      cmData.data()?.algolia_index !== ""
    ) {
      //algolia is set then decrypt the secret.

      algolia.app_id = decrypt(algolia.app_id, secretData.data()?.secret);
      algolia.app_secret = decrypt(
        algolia.app_secret,
        secretData.data()?.secret
      );
      // init algolia
      const client = algoliasearch(algolia.app_id, algolia.app_secret);
      const index = client.initIndex(cmData.data()?.algolia_index);
      // check if deleted
      if (!snapshot.after.exists) {
        // delete obj from algolia
        await index.deleteObject(snapshot.before.id);
      } else {
        // update create operation
        await index.saveObject({
          objectID: snapshot.after.id,
          ...snapshot.after.data(),
        });
      }
    } else {
      // do nothing
      return;
    }
  });
