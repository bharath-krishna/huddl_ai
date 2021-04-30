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
  let resp = [];
  if (req.method === "GET") {
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .get()
      .then((data) => {
        return data.docs.map((doc) => {
          resp.push({ ...doc.data(), id: doc.id });
        });
      })
      .catch((err) => {
        res.json({ message: "Something went wrong" });
      });

    res.statusCode = 200;
    res.json(resp);
    return;
  } else if (req.method === "POST") {
    const body = req.body;
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .add({
        ...body,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: profile.name,
      })
      .then((doc) => {
        res.statusCode = 200;
        res.json({ message: `feed ${doc.id} Created Successfully` });
      })
      .catch((err) => {
        res.statusCode = 400;
        res.json({ message: "Something went wrong" });
      });
    return;
  }
};
