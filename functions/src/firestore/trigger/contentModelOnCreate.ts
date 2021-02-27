import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export default async function contentModelOnCreate(
  snapshot: QueryDocumentSnapshot,
  context: functions.EventContext
) {
  // first its for sure it run  when record created on 'iris_content_model'
  // create permission for all role
  const db = admin.firestore();
  const collection = db.collection("iris_role_permission");
  const result = await collection.listDocuments();
  const permissionResourceName = snapshot.id.toString().substr(5);
  try {
    // @ts-ignore
    await db.runTransaction(function(t){
      for (const row of result) {
        t.update(row, {
          ["permission." + permissionResourceName]: {
            create: row.id.toString() === "super_admin",
            update: row.id.toString() === "super_admin",
            delete: row.id.toString() === "super_admin",
            read: row.id.toString() === "super_admin",
            type: "user",
          },
        });
      }
    });
  } catch (e) {
    throw new HttpsError("unknown", e);
  }
}
