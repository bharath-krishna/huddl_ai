import { HYDRATE } from "next-redux-wrapper";
import { applyMiddleware, createStore } from "redux";
import { createWrapper } from "next-redux-wrapper";
import { combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { userProfileReducer } from "./reducers/usertReducer";
import { feedsReducer } from "./reducers/feeds";
import { commentsReducer } from "../redux/reducers/comments";

const bindMiddleware = (middleware) => {
  // if (process.env.NODE_ENV !== "production") {
  const { composeWithDevTools } = require("redux-devtools-extension");
  return composeWithDevTools(applyMiddleware(...middleware));
  // }
  // return applyMiddleware(...middleware);
};

const allReducers = combineReducers({
  userProfile: userProfileReducer,
  feeds: feedsReducer,
  comments: commentsReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    if (state.count.count) nextState.count.count = state.count.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return allReducers(state, action);
  }
};

const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper(initStore);
