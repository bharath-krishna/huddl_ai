import { verifyToken } from "../../../../utils/validateToken";
import firebase from "../../../../utils/firebaseClient";

export default async (req, res) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ error: "Missing Authorization header" });
  }

  let token = req.headers.authorization;

  let profile = null;
  if (token.startsWith("Bearer ")) {
    const pos = "Bearer ".length;
    token = token.substring(pos);
    profile = verifyToken(token);

    if (!profile) {
      return res.status(401).json({ error: "Unuthorized" });
    }
  }

  const { feedId } = req.query;
  const collectionName = "likes";
  let resp = [];
  if (req.method === "GET") {
    const body = { feedId, userId: profile.id };
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .where("userId", "==", profile.id)
      .where("feedId", "==", feedId)
      .get()
      .then((result) => {
        result.docs.map((doc) => {
          const data = firebase
            .firestore()
            .collection(collectionName)
            .doc(doc.id)
            .delete()
            .then(() => {
              return res.status(200).json({ message: "Unliked" });
            })
            .catch((err) => {
              return res.status(400).json({ err: "Something went wrong" });
            });
        });
        res.json();
      });
  }
};
