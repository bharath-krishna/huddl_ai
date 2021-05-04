import axios from "axios";
import { SET_USER_PROFILE } from "../constants";

export const setUserProfile = (profile) => {
  return { type: SET_USER_PROFILE, payload: profile };
};
