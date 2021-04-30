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

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.json({
      message: "Method Not Allowed",
    });
    return;
  }

  const body = req.body;
  const collectionName = "feeds";

  const { id } = req.query;
  const data = await firebase.firestore().collection(collectionName).get();

  res.statusCode = 200;
  const respData = data.docs.map((doc) => {
    if (doc.id === id) {
      return doc.data();
    }
  });

  if (!respData[0]) {
    res.statusCode = 404;
    res.json({ message: "Not Found" });
  } else {
    res.statusCode = 200;
    res.json(respData[0]);
  }
};
