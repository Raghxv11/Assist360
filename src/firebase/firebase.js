import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBO6oqU9jai7g211Z1NZGwqz0Gu96ZUed4",
  authDomain: "cse360-f195e.firebaseapp.com",
  projectId: "cse360-f195e",
  storageBucket: "cse360-f195e.appspot.com",
  messagingSenderId: "315312139125",
  appId: "1:315312139125:web:118c3b6ac14490739f013c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const FIRESTORE_DB = getFirestore(app)



export { app, auth, FIRESTORE_DB };
