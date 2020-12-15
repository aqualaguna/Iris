import * as admin from "firebase-admin";

export default async function isRole(uid: string, role: string) {
  const doc = admin.firestore().collection("iris_user").doc(uid);
  const data = await doc.get();
  if (data.exists) {
    return (data.data() || { role_id: "" }).role_id === role;
  } else {
    return false;
  }
}
