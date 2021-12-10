import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

// Central reducer to store
export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});
