import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";

// The Firebase Admin SDK to access Cloud Firestore.
import * as admin from "firebase-admin";
import simpleAuth from "../helper/simpleAuth";
/**
 * schema for data
 * {
 *  content: 'test',
 *  plugin_name: 'test'
 * }
 */
const schema = {
  required: ["content", "plugin_name"],
  properties: {
    content: { type: "string" },
    plugin_name: { type: "string" },
  },
};
export default functions.https.onCall(async (data, context) => {
  // check for user
  simpleAuth(data, context, schema);
  const user_id = context.auth ? context.auth.uid : null;
  // check if user super admin
  const userDoc = admin
    .firestore()
    .collection("iris_user")
    .doc(user_id || "");
  const userData = await userDoc.get();
  if (userData.exists) {
    // let check if its role superadmin
    const user = userData.data();
    if (user && user.role !== "super_admin") {
      throw new HttpsError(
        "permission-denied",
        "you do not have permission to update Firestore Rule"
      );
    }
  }
  const ruleService = admin.securityRules();
  // so you are super admin?
  // let get started
  let regex = /(\/\/ #plugin-rule-start)(?<content>.*)(\/\/ #plugin-rule-end)/gms;
  let ruleset = await ruleService.getFirestoreRuleset();
  let content = ruleset.source[0].content;
  let res = regex.exec(content);
  let pluginRules =
    res && res.groups && typeof res.groups.content == "string"
      ? res.groups.content
      : null;
  if (pluginRules) {
    // there is content
    let regexInner = new RegExp(
      `(\\\/\\\/ #plugin-${data.plugin_name}-start)(?<content>.*)(\\\/\\\/ #plugin-${data.plugin_name}-end)`,
      "gms"
    );
    let pluginMatch = regexInner.exec(pluginRules);
    if (pluginMatch) {
      // there is match replace it
      pluginRules = pluginRules.replace(regexInner, data.content);
      // replace content
      content.replace(regex, "$1" + pluginRules + "$3");
    } else {
      // add it
      pluginRules +=
        "\n" +
        `// #plugin${data.plugin_name}-start\n${data.content}\n// #plugin${data.plugin_name}-end\n`;
      content = content.replace(regex, "$1" + pluginRules + "$3");
    }
    // replace insert success
    await ruleService.releaseFirestoreRulesetFromSource(content);
    return {
      code: "ok",
      message: "success update firestore rules.",
    };
  } else {
    throw new HttpsError(
      "not-found",
      "plugin start and end not found in rule."
    );
  }
});
