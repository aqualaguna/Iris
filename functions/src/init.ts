
import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
// The Firebase Admin SDK to access Cloud Firestore.
// import * as admin from "firebase-admin";

export default functions.https.onCall(async (data, context) => {
  //const see read firebase settings
  const db = admin.firestore();
  const doc = db.collection('iris_global').doc('iris_settings');
  const settings = await doc.get();
  if (settings.exists) {
    return {
      code: 'ok',
      message: 'already initialized',
    }
  } else {
    await initPermission(db);
    let payload = {
      initialized: true
    };
    await doc.set(payload);
    return {
      code: 'ok',
      message: 'initialized',
    }
  }
})


export async function initPermission(db :FirebaseFirestore.Firestore) {
  const col = db.collection('iris_role_permission');
  return await db.runTransaction((transaction) => {
    const task = [
      initSuperAdminRole(transaction, col),
      initAdminRole(transaction, col),
    ]
    return Promise.all(task);
  });
  
}


async function initSuperAdminRole(transaction: FirebaseFirestore.Transaction, col : FirebaseFirestore.CollectionReference) {
  const payload = {
    name: 'Super Admin',
    role: 'super_admin',
    permission: {
      content_model: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        deconste: true,
      },
      storage: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        deconste: true,
      },
      role: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        deconste: true,
      },
      user: {
        type: 'system',
        create: true,
        assign_role: true,
        read: true,
        update: true,
        deconste: true,
      },
    }
  };
  const doc = col.doc('super_admin');
  transaction.set(doc, payload);
}

async function initAdminRole(transaction: FirebaseFirestore.Transaction, col:FirebaseFirestore.CollectionReference) {
  const payload = {
    name: 'Admin',
    role: 'admin',
    permission: {
      content_model: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        deconste: true,
      },
      storage: {
        type: 'system',
        create: true, // create file or folder
        read: true, // read file or folder
        update: true, //  move file or folder
        deconste: true, // deconste file or folder
      },
      role: {
        type: 'system',
        create: false,
        read: true,
        update: false,
        deconste: false,
      },
      user: {
        type: 'system',
        create: false,
        assign_role: false,
        read: true,
        update: false,
        deconste: false,
      },
    }
  };
  const doc = col.doc('admin');
  transaction.set(doc, payload);
}
