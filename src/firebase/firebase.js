// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBAE_API_KEY ,
  authDomain: "cleancity-a418e.firebaseapp.com",
  projectId: "cleancity-a418e",
  storageBucket: "cleancity-a418e.appspot.com",
  messagingSenderId: "730660272987",
  appId: "1:730660272987:web:094998a860360c4af4387e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)