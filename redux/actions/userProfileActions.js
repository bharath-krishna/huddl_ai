import axios from "axios";
import { SET_USER } from "../constants";

export const setUserProfile = (profile) => {
  return { type: SET_USER, payload: profile };
};
