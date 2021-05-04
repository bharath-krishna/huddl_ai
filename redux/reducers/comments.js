import { SET_COMMENTS } from "../constants";

const initialPeopleState = [];
export const commentsReducer = (state = initialPeopleState, action) => {
  switch (action.type) {
    case SET_COMMENTS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
