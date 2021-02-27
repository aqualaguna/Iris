import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

import copyFiles from "./storage/copyFiles";
import ping from "./ping";
import version from "./version";
import createThumbnail from "./general/createThumbnail";
import updateFirestoreRules from "./firestore/updateFirestoreRules";
import init from "./init";
import setSettings from "./setSettings";
import firestoreTrigger from "./firestore/firestoreTrigger";

// function to see ping
// standard hello world
exports.ping = ping;
// function to see iris functions.
exports.version = version;
// function to copy files since client inefficient if not using admin sdk
exports.copyFiles = copyFiles;
// function to create thumbnail on request
exports.createThumbnail = createThumbnail;

exports.updateFirestoreRules = updateFirestoreRules;
// init function
exports.init = init;
// setSettings
exports.setSettings = setSettings;

// firestore trigger
exports.firestoreTrigger = firestoreTrigger;

// TEST FUNCTION
// debug only and dev only please do not use this functions.
exports.test = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  res.json({ result: 1 });
});

