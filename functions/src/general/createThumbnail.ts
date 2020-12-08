import * as functions from "firebase-functions";
const HttpsError = functions.https.HttpsError;
// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from "firebase-admin";
import simpleAuth from "../helper/simpleAuth";

const spawn = require("child-process-promise").spawn;
const path = require("path");
const os = require("os");
const fs = require("fs");
const mkdirp = require("mkdirp");

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = "thumb_";

const schema = {
  properties: {
    path: { type: "string" },
  },
};
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
export default functions.https.onCall(async (data, context) => {
  simpleAuth(data, context, schema);
  const bucket = admin.storage().bucket();
  let file = bucket.file(data.path);
  if (!(await file.exists())) {
    throw new HttpsError(
      "not-found",
      "cannot find your file in specified path."
    );
  }
  const resp = await file.get();
  file = resp[0];
  const meta: any = resp[1];
  // File and directory paths.
  const filePath = file.name;
  const contentType = meta.contentType; // This is the image MIME type
  const fileDir = path.dirname(data.path);
  const fileName = path.basename(data.path);
  const thumbFilePath = path.normalize(
    path.join(fileDir, `${THUMB_PREFIX}${fileName}`)
  );
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith("image/")) {
    throw new HttpsError("failed-precondition", "file provided is not image.");
  }

  // Exit if the image is already a thumbnail.
  if (
    fileName.startsWith(THUMB_PREFIX) ||
    (await bucket.file(thumbFilePath).exists())
  ) {
    throw new HttpsError("failed-precondition", "already have thumbnail.");
  }

  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await file.download({ destination: tempLocalFile });
  // Generate a thumbnail using ImageMagick.
  await spawn(
    "convert",
    [
      tempLocalFile,
      "-thumbnail",
      `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
      tempLocalThumbFile,
    ],
    { capture: ["stdout", "stderr"] }
  );
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {
    destination: thumbFilePath,
    metadata: metadata,
  });
  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  // Get the Signed URLs for the thumbnail and original image.
  const config: any = {
    action: "read",
    expires: "03-01-2500",
  };
  const results = await Promise.all([
    thumbFile.getSignedUrl(config),
    file.getSignedUrl(config),
  ]);
  const thumbResult = results[0];
  const originalResult = results[1];
  const thumbFileUrl = thumbResult[0];
  const fileUrl = originalResult[0];
  return { path: fileUrl, thumbnail: thumbFileUrl };
});
