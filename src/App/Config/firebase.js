import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxkTZxwZPe5HknrC99QAqEIEFfgusFDk0",
  authDomain: "whatsapp-clone-8cacb.firebaseapp.com",
  projectId: "whatsapp-clone-8cacb",
  storageBucket: "whatsapp-clone-8cacb.appspot.com",
  messagingSenderId: "249580557123",
  appId: "1:249580557123:web:b367ed15f10ff42b9d15f6",
  measurementId: "${config.measurementId}",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
