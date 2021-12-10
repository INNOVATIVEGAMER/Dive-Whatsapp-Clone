import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App/Layout/App";
import reportWebVitals from "./reportWebVitals";
import firebase from "./App/Config/firebase";
import { configureStore } from "./Redux/Store/configureStore";
import { createFirestoreInstance } from "redux-firestore";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import history from "./history";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

// Creating store for redux
const store = configureStore();

// Setting up firebase to connect with react
const rrfConfig = {
  userProfile: "users",
  attachAuthReady: true,
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
