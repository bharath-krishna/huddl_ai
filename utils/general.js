import firebase from "./firebaseClient";

export const getById = async (collectionName, id) => {
  return await (
    await firebase.firestore().collection(collectionName).doc(id).get()
  ).data();
};
