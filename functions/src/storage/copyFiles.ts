import * as functions from "firebase-functions";
const HttpsError = functions.https.HttpsError;
// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from "firebase-admin";
import simpleAuth from "../helper/simpleAuth";
/**
 * format data:
 * {
 *  mode: 'copy'
 *  destination: 'ss/123',
 *  source: 'ss/test',
 *  files: [
 *  'ss/test/t.jpg',
 *  'ss/test/t1.jpg',
 *  ]
 * }
 */
const schema = {
  required: ["destination", "source", "files"],
  properties: {
    mode: { enum: ["copy", "move"], default: "copy" },
    destination: { type: "string" },
    source: { type: "string" },
    files: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};
export default functions.https.onCall(async (data, context) => {
  simpleAuth(data, context, schema);
  // check if have permission
  // copy => read, create
  // move => read, create, delete
  const uid = context.auth?.uid || "";
  let doc = admin.firestore().collection("iris_user").doc(uid);
  let userdata = await doc.get();

  if (!userdata.exists)
    throw new HttpsError(
      "permission-denied",
      "you are not registered on iris table."
    );
  const role_id = userdata.data()?.role_id;
  // get role
  if (!role_id) {
    throw new HttpsError(
      "permission-denied",
      "new user can't do anything.ask for your admin for role."
    );
  }
  // check permission
  let roledoc = admin
    .firestore()
    .collection("iris_role_permission")
    .doc(role_id);
  let roledata = await roledoc.get();
  if (!roledata.exists)
    throw new HttpsError("permission-denied", "role record does not exists.");
  let role: any = roledata.data();
  let permission = role.permission.storage;
  if (data.mode === "copy" && !(permission.read && permission.create))
    throw new HttpsError(
      "permission-denied",
      "you do not have permission to do this action."
    );
  if (
    data.mode === "move" &&
    !(permission.read && permission.create && permission.delete)
  )
    throw new HttpsError(
      "permission-denied",
      "you do not have permission to do this action."
    );
  // let copy it shall we?
  const storage = admin.storage();
  const bucket = storage.bucket();
  const copyTask: any[] = [];
  for (const file of data.files) {
    const fileobj = bucket.file(file);
    const relativePath = file.replace(data.source, "");
    const destination =
      data.destination + (relativePath[0] === "/" ? "" : "/") + relativePath;
    if (data.mode === "copy") copyTask.push(fileobj.copy(destination));
    else copyTask.push(fileobj.move(destination));
  }
  return await Promise.all(copyTask)
    .then(() => {
      return {
        code: "ok",
        message: "success copying file",
      };
    })
    .catch((e) => {
      functions.logger.error(e);
      throw new HttpsError("unknown", e.message, e);
    });
});
