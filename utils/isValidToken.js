import jwt_decode from "jwt-decode";

const isValidToken = (token) => {
  try {
    const decoded = jwt_decode(token, null, 2);
    return true;
  } catch {
    return false;
  }
};

export default isValidToken;
