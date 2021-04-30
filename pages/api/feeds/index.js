import { verifyToken } from "../../../utils/validateToken";
import firebase from "../../../utils/firebaseClient";

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

  const collectionName = "feeds";
  if (req.method === "GET") {
    const data = await firebase.firestore().collection(collectionName).get();

    res.statusCode = 200;
    res.json(data.docs.map((doc) => doc.data()));
    return;
  } else if (req.method === "POST") {
    const body = req.body;
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .add(body);
    console.log(data);

    res.statusCode = 200;
    res.json({ message: "Created Successfully" });
    return;
  }
};
