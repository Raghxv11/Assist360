import { auth, FIRESTORE_DB } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
export const doCreateUserWithEmailAndPassword = async (email, password, inviteCode) => {
  const users = await getDocs(collection(FIRESTORE_DB, "users"));
  let isAdmin = users.empty;
  
  if(!isAdmin && inviteCode === "") {
    alert("Please enter a valid invite code");
    return false;
  }

  if(!isAdmin) {
    const inviteCodeDoc = await getDoc(doc(FIRESTORE_DB, "codes", inviteCode));
    if (!inviteCodeDoc.exists()) {
      alert("Invalid invite code");
      return false;
    }
  }

  // Create the user authentication
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid; // Get the user's UID

  // Delete the invite code if used
  if (inviteCode) {
    await deleteDoc(doc(FIRESTORE_DB, "codes", inviteCode));
  }

  // Create the user document with the UID as the document ID
  await setDoc(doc(FIRESTORE_DB, "users", uid), {
    email: email,
    roles: [isAdmin ? "admin" : "student"],
    group: "", // Initialize empty group
    createdAt: new Date()
  });

  return true;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // add user to firestore
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};
