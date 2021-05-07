import { verifyToken } from "../../../../utils/validateToken";
import firebase from "../../../../utils/firebaseClient";
import axios from "axios";
import getAbsoluteURL from "../../../../utils/getAbsoluteURL";

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

  const { profileId } = req.query;

  if (req.method === "GET") {
    const collectionName = "feeds";

    const data = await firebase
      .firestore()
      .collection(collectionName)
      .where("createdBy.id", "==", profileId)
      .get()
      .then(async (data) => {
        return await Promise.all(
          data.docs.map(async (feedDoc) => {
            let comments = [];
            let likes = [];
            let profile;
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
                });

              url = getAbsoluteURL(`/api/profile/${profileId}`, req);
              await axios
                .get(url, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((result) => {
                  profile = result.data;
                });
            }

            return {
              ...feedDoc.data(),
              id: feedDoc.id,
              likes: likes,
              comments: comments,
              profile: profile,
            };
          })
        );
      });

    return res.status(200).json(data);
  }

  res.status(405).json({ err: "Method Not Allowed" });
};
