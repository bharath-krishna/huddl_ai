import { SET_COMMENTS } from "../constants";

export const setComments = (comments) => {
  return {
    type: SET_COMMENTS,
    payload: comments,
  };
};
