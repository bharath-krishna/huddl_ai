import { SET_FEEDS } from "../constants";

export const setFeeds = (feeds) => {
  return {
    type: SET_FEEDS,
    payload: feeds,
  };
};
