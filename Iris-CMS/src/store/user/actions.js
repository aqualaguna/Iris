import firebase from "firebase/app";
import "firebase/firestore";

export default {
    async deleteUser({ rootState }, id) {
        let app = firebase.app(rootState.selectedApp.projectId);
        if (!app) return false;
        let db = app.firestore();
        let currentUser = app.auth().currentUser;
        if (!currentUser) return false;
        let col = db.collection("iris_user");
        let doc = col.doc(id);
        let data = await doc.get();
        if  (data.exists) {
          return doc.delete().then(() => {
            return {
              position: "bottom-center",
              color: "success",
              text: `User '${data.data().email}' has been deleted.`,
              title: "User Deleted!",
            };
          })
        }
        return false;
      },
};
