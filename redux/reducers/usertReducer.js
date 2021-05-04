import { SET_USER_PROFILE } from "../constants";

const initialPeopleState = { name: "", id: "", likes: [] };
export const userProfileReducer = (state = initialPeopleState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE: {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};
