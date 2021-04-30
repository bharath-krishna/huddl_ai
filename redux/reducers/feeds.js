import { SET_FEEDS } from "../constants";

const initialPeopleState = [];
export const feedsReducer = (state = initialPeopleState, action) => {
  switch (action.type) {
    case SET_FEEDS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
