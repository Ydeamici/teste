import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxGFVMO2Pgzamd7s84aFqBsmCXZlhN2tc",

  authDomain: "info-db609.firebaseapp.com",

  projectId: "info-db609",

  storageBucket: "info-db609.appspot.com",

  messagingSenderId: "1067529521104",

  appId: "1:1067529521104:web:7e92c959e03049809e1bd5",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
export { auth, firestore, storage };
