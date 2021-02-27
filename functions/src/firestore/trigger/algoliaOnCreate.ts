import { decrypt } from "../../helper/crypt";
import algoliasearch from "algoliasearch";

export default async function algoliaOnCreate(settingsData: any, cmData: any, secretData: any, snapshot: any) {
  const algolia = settingsData.data()?.algolia;
    if (
      typeof algolia === "object" &&
      algolia.app_id &&
      cmData.data()?.algolia_index !== ""
    ) {
      //algolia is set then decrypt the secret.
      algolia.app_secret = decrypt(
        algolia.app_secret,
        secretData.data()?.secret
      );
      // init algolia
      const client = algoliasearch(algolia.app_id, algolia.app_secret);
      const index = client.initIndex(cmData.data()?.algolia_index);
      // check if deleted
      if (!snapshot.after.exists) {
        // delete obj from algolia
        await index.deleteObject(snapshot.before.id);
      } else {
        // check if archived
        if (
          !snapshot.before.data()?.archived &&
          snapshot.after.data()?.archived
        ) {
          await index.deleteObject(snapshot.before.id);
        }
        // update create operation
        else
          await index.saveObject({
            objectID: snapshot.after.id,
            ...snapshot.after.data(),
          });
      }
    }
}