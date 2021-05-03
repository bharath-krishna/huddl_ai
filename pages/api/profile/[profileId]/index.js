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
    const profile = verifyToken(token);
    if (!profile) {
      return res.status(401).json({ error: "Unuthorized" });
    }
  }

  const { profileId } = req.query;
  // Update below line with collection name
  const collectionName = "profile";

  const data = await firebase
    .firestore()
    .collection(collectionName)
    .doc(profileId)
    .get();

  let resp;
  if (data.exists) {
    res.statusCode = 200;
    resp = { ...data.data(), id: data.id };
  } else {
    res.statusCode = 404;
    resp = { err: "Not Found" };
  }

  res.json(resp);
};
