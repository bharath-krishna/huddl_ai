import { verifyToken } from "../../utils/validateToken";
import firebase from "../../utils/firebaseClient";

export default async (req, res) => {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ error: "Missing Authorization header" });
  }
  const token = req.headers.authorization;

  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Unuthorized" });
  }

  // Update below line with collection name
  const collectionName = "profile";

  const data = await firebase.firestore().collection(collectionName).get();

  res.statusCode = 200;
  res.json(data.docs.map((doc) => doc.data()));
};
