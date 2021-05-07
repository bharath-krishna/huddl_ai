import { verifyToken } from "../../../utils/validateToken";
import firebase from "../../../utils/firebaseClient";
import getAbsoluteURL from "../../../utils/getAbsoluteURL";
import axios from "axios";

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

  const collectionName = "feeds";
  let resp = [];
  if (req.method === "GET") {
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .orderBy("createdAt", "desc")
      .get()
      .then(async (data) => {
        return await Promise.all(
          data.docs.map(async (feedDoc) => {
            let comments = [];
            let likes = [];
            let feedProfile;
            if (feedDoc.exists) {
              let url = getAbsoluteURL(`/api/feeds/${feedDoc.id}/likes`, req);
              await axios
                .get(url, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((result) => {
                  result.data.map((like) => {
                    likes.push(like.userId);
                  });
                })
                .catch((err) => {});

              url = getAbsoluteURL(`/api/feeds/${feedDoc.id}/comments`, req);
              await axios
                .get(url, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((result) => {
                  comments = result.data;
                })
                .catch((err) => {});

              url = getAbsoluteURL(`/api/profile/${profile.id}`, req);
              await axios
                .get(url, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((result) => {
                  feedProfile = result.data;
                })
                .catch((err) => {});
            }
            return {
              ...feedDoc.data(),
              id: feedDoc.id,
              likes: likes,
              comments: comments,
              profile: feedProfile,
            };
          })
        );
      })
      .catch((err) => {
        return res.json({ message: "Something went wrong" });
      });
    return res.status(200).json(data);
  } else if (req.method === "POST") {
    const body = req.body;
    const newData = {
      ...body,
      // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
      createdBy: { name: profile.name, id: profile.id },
    };
    const data = await firebase
      .firestore()
      .collection(collectionName)
      .add(newData)
      .then((doc) => {
        res.statusCode = 200;
        const feed = { ...newData, id: doc.id };
        res.json({ message: "OK", ...feed });
      })
      .catch((err) => {
        res.statusCode = 400;
        res.json({ message: "Something went wrong" });
      });
    return;
  }
};
