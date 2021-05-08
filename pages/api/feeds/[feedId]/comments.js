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

  const collectionName = "comments";
  const { feedId } = req.query;
  let resp = [];
  if (req.method === "GET") {
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .where("feedId", "==", feedId)
      .orderBy("createdAt", "desc")
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
            resp.push({ ...doc.data(), id: doc.id, profile: feedProfile });
          })
        );
      })
      .catch((err) => {
        return res.json({ message: "Something went wrong" });
      });

    res.statusCode = 200;
    res.json(resp);
    return;
  } else if (req.method === "POST") {
    const body = req.body;
    const newComment = {
      ...body,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: {
        name: profile.name,
        id: profile.id,
      },
      feedId: feedId,
    };
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .add(newComment)
      .then(async (doc) => {
        let feedProfile;
        feedProfile = await firebase
          .firestore()
          .collection("profile")
          .doc(profile.id)
          .get()
          .then((pdoc) => {
            return { ...pdoc.data(), id: pdoc.id };
          });
        res.statusCode = 200;
        res.json({ ...newComment, id: doc.id, profile: feedProfile });
      })
      .catch((err) => {
        res.statusCode = 400;
        res.json({ message: "Something went wrong" });
      });
    return;
  }
};
