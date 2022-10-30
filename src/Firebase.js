import {initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const app = initializeApp({
    apiKey: "AIzaSyCCpHlDkBJG-liBbHqO25K7AtZCVeIm55M",
    authDomain: "firenahiaaghume.firebaseapp.com",
    projectId: "firenahiaaghume",
    storageBucket: "firenahiaaghume.appspot.com",
    messagingSenderId: "774349499411",
    appId: "1:774349499411:web:244473065f6baa298ae3e6"
})

// const db = App.firestore()
const auth = getAuth();
const db = getFirestore(app);

export { auth , db };