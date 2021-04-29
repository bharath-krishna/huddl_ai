import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";

const isValidToken = (token) => {
  try {
    const decoded = jwt_decode(token, null, 2);
    return true;
  } catch {
    return false;
  }
};

export default isValidToken;

export function verifyToken(jwtToken) {
  try {
    return jwt.verify(jwtToken, "somesecret");
  } catch (e) {
    console.log("e:", e);
    return false;
  }
}
