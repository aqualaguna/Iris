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
    mode: {enum: ['copy', 'move'], default: 'copy'},
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
  // let copy it shall we?
  const storage = admin.storage();
  const bucket = storage.bucket();
  const copyTask: any[] = [];
  for (const file of data.files) {
    const fileobj = bucket.file(file);
    const relativePath = file.replace(data.source, "");
    const destination = data.destination + (relativePath[0] === '/' ? '' : '/') + relativePath;
    if(data.mode === 'copy')
      copyTask.push(fileobj.copy(destination));
    else 
      copyTask.push(fileobj.move(destination));
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
