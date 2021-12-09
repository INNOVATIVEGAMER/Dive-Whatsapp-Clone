import { createStore, applyMiddleware } from "redux";
import { compose } from "redux";
import thunk from "redux-thunk";
import reducers from "../Reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk];

export const configureStore = () => {
  const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
