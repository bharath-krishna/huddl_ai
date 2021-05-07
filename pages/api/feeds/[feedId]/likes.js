import { verifyToken } from "../../../../utils/validateToken";
import firebase from "../../../../utils/firebaseClient";

const getFeedLikes = async (req, res) => {
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
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .where("feedId", "==", feedId)
      .get()
      .then((data) => {
        res.status(200);
        data.docs.map((doc) => {
          resp.push({ ...doc.data(), id: doc.id });
        });
      })
      .catch((err) => {
        res.status(400);
        resp.push({ error: "Something went wrong" });
      });
  }
  res.json(resp);
};

export default getFeedLikes;
