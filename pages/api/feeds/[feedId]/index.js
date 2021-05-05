import { verifyToken } from "../../../../utils/validateToken";
import firebase from "../../../../utils/firebaseClient";

export default async (req, res) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ error: "Missing Authorization header" });
  }

  let token = req.headers.authorization;

  if (token.startsWith("Bearer ")) {
    const pos = "Bearer ".length;
    token = token.substring(pos);
    if (!verifyToken(token)) {
      return res.status(401).json({ error: "Unuthorized" });
    }
  }

  if (req.method === "GET") {
    const collectionName = "feeds";

    const { feedId } = req.query;
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .get()
      .then(async (data) => {
        return await Promise.all(
          data.docs.map(async (doc) => {
            let feedProfile;
            if (doc.exists) {
              feedProfile = await firebase
                .firestore()
                .collection("profile")
                .doc(doc.data().createdBy.id)
                .get()
                .then((doc) => {
                  return { ...doc.data(), id: doc.id };
                });
            }
            return { ...doc.data(), id: doc.id, profile: feedProfile };
          })
        );
      });

    res.statusCode = 200;
    let resp = [];
    data.map((doc) => {
      if (doc.id === feedId) {
        resp.push(doc);
        return doc;
      }
    });

    if (resp.length === 0) {
      res.statusCode = 404;
      res.json({ message: "Not Found" });
    } else {
      res.statusCode = 200;
      res.json(resp[0]);
    }
  } else if (req.method === "DELETE") {
    const body = req.body;
    const collectionName = "feeds";

    const { feedId } = req.query;
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .doc(feedId)
      .delete()
      .then((result) => {})
      .catch((err) => {});
    res.json({ message: "Feed Deleted" });
  }
};
