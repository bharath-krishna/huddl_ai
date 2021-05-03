import { SET_USER } from "../constants";

const initialPeopleState = { name: "", id: "", likes: [] };
export const userProfileReducer = (state = initialPeopleState, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};
