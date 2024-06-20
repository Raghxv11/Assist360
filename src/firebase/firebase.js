import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsXwtiUrvm3i8nPXxyF4vG42qHH0TFVdw",
  authDomain: "visualizer-authenticatio-919a8.firebaseapp.com",
  projectId: "visualizer-authenticatio-919a8",
  storageBucket: "visualizer-authenticatio-919a8.appspot.com",
  messagingSenderId: "529501363131",
  appId: "1:529501363131:web:a09a2cc809067ab4edc29e",
  measurementId: "G-WWTMPZLDR7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)



export { app, auth };
