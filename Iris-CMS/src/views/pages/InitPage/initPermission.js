export default async function initPermission(db, log) {
  let col = db.collection('iris_role_permission');
  return await db.runTransaction((transaction) => {
    let task = [
      initSuperAdminRole(transaction, col, log),
      initAdminRole(transaction, col, log),
    ]
    return Promise.all(task);
  });
  
}


// post_self: {
//   type: 'plugin',
//   create: true,
//   read: true,
//   update: true,
//   delete: true,
//   publish: true,
// },
// post_other: {
//   type: 'plugin',
//   create: true,
//   read: true,
//   update: true,
//   delete: true,
//   publish: true,
// },

async function initSuperAdminRole(transaction, col, log) {
  log.push('creating Super Admin Role & Permission.')
  let payload = {
    name: 'Super Admin',
    role: 'super_admin',
    permission: {
      content_model: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      storage: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      role: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      user: {
        type: 'system',
        create: true,
        assign_role: true,
        read: true,
        update: true,
        delete: true,
      },
    }
  };
  let doc = col.doc('super_admin');
  transaction.set(doc, payload);
}

async function initAdminRole(transaction, col, log) {
  log.push('creating Admin Role & Permission.')
  let payload = {
    name: 'Admin',
    role: 'admin',
    permission: {
      content_model: {
        type: 'system',
        create: true,
        read: true,
        update: true,
        delete: true,
      },
      storage: {
        type: 'system',
        create: true, // create file or folder
        read: true, // read file or folder
        update: true, //  move file or folder
        delete: true, // delete file or folder
      },
      role: {
        type: 'system',
        create: false,
        read: true,
        update: false,
        delete: false,
      },
      user: {
        type: 'system',
        create: false,
        assign_role: false,
        read: true,
        update: false,
        delete: false,
      },
    }
  };
  let doc = col.doc('admin');
  transaction.set(doc, payload);
}
