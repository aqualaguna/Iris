import firebase from "firebase/app";
import "firebase/firestore";

export default {
  listenIrisContentModel({ state, commit }, app) {
    if (!app) return false;
    let db = firebase.firestore(app);
    let currentUser = app.auth().currentUser;
    if (!currentUser) return false;
    let col = db.collection("iris_content_model");
    commit('emptyContentModel');
    let cancelFunc = col.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((dc) => {
        switch (dc.type) {
          case "added":
            commit("addIrisContentModel", {
              id: dc.doc.id,
              ...dc.doc.data(),
            });
            break;
          case "removed": {
            let index = state.irisContentModel.findIndex(
              (t) => t.id == dc.doc.id
            );
            if (index != -1) commit("removeIrisContentModel", index);
            break;
          }
          case "modified": {
            let index = state.irisContentModel.findIndex(
              (t) => t.id == dc.doc.id
            );
            if (index != -1)
              commit("updateIrisContentModel", {
                index,
                modified: {
                  id: dc.doc.id,
                  ...dc.doc.data(),
                },
              });
            break;
          }
        }
      });
    });
    commit(
      "setListener",
      { key: "collectionListener", value: cancelFunc },
      { root: true }
    );
    return true;
  },
  async archiveContentModel({ rootState }, id) {
    let app = firebase.app(rootState.selectedApp.projectId);
    if (!app) return false;
    let db = app.firestore();
    let currentUser = app.auth().currentUser;
    if (!currentUser) return false;
    let col = db.collection("iris_content_model");
    let doc = col.doc(id);
    let data = await doc.get();
    if (data.exists) {
      // archived it
      let archived = !data.data().archived;
      return doc
        .update({
          archived,
        })
        .then(() => {
          if (archived)
            return {
              position: "bottom-center",
              color: "success",
              title: "Collection Archived!",
              text:
                "this collection will not appear on menu. but the data still exists. You will get warning when using this collection in SDK.",
            };
          else
            return {
              position: "bottom-center",
              color: "success",
              title: "Collection Un-Archived!",
              text: "this collection will appear on menu again.",
            };
        });
    } else {
      return {
        position: "bottom-center",
        color: "danger",
        text:
          "Please refresh your browser or clear your cache. this is unexpected error.",
        title: "Document does not exists!",
      };
    }
  },
  async deleteContentModel({ rootState }, tr) {
    let app = firebase.app(rootState.selectedApp.projectId);
    if (!app) return false;
    let db = app.firestore();
    let currentUser = app.auth().currentUser;
    let coldata = db.collection(tr.collection_name);
    if (!currentUser) return false;
    let col = db.collection("iris_content_model");
    let doc = col.doc(tr.id);
    let data = await doc.get();
    let batch = db.batch();
    if (data.exists) {
      // get all data and delete it
      let temp = await coldata.get();
      for (const d of temp.docs) {
        batch.delete(d);
      }
      // delete collection info
      batch.delete(doc);
      return batch
        .commit()
        .then(() => {
          return {
            position: "bottom-center",
            color: "success",
            text: "Collection & its data is deleted.",
            title: "Collection Deleted!",
          };
        });
    }
    return false;
  },
  async createContentModel({rootState}, payload) {
    let app = firebase.app(rootState.selectedApp.projectId);
    if (!app) return false;
    let db = app.firestore();
    let currentUser = app.auth().currentUser;
    if (!currentUser) return false;
    let col = db.collection("iris_content_model");
    let doc = col.doc(payload.collection_name);
    let snap = await doc.get();
    if (snap.exists) {
      return {
        title: "Content Model Name already Exists!",
        text: "Please use other name.",
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
        position: "bottom-center",
      };
    } else {
      return doc.set(payload).then(() => {
        return ({
          title: "Content Model Saved!",
          color: "success",
          iconPack: "feather",
          icon: "icon-check",
          position: "bottom-center",
        });
      });
    }
  },
  async updateContentModel({rootState}, payload) {
    let app = firebase.app(rootState.selectedApp.projectId);
    if (!app) return false;
    let db = app.firestore();
    let currentUser = app.auth().currentUser;
    if (!currentUser) return false;
    let col = db.collection("iris_content_model");
    let doc = col.doc(payload.collection_name);
    let snap = await doc.get();
    if (!snap.exists) {
      return {
        title: "Content Model not Exists!",
        text: "please make sure you are updating existing content model.",
        color: "warning",
        iconPack: "feather",
        icon: "icon-alert-circle",
        position: "bottom-center",
      };
    } else {
      return doc.update(payload).then(() => {
        return ({
          title: "Content Model Saved!",
          color: "success",
          iconPack: "feather",
          icon: "icon-check",
          position: "bottom-center",
        });
      });
    }
  },
};
