import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABcaNhMwFNrdmBRZSHgMExJ0zp24VWIPI",
  authDomain: "cursos-alfaweb-b84d3.firebaseapp.com",
  projectId: "cursos-alfaweb-b84d3",
  storageBucket: "cursos-alfaweb-b84d3.appspot.com",
  messagingSenderId: "964427017237",
  appId: "1:964427017237:web:c09c9a5229f9352498721c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const currentUserPromise = () =>
  new Promise((resolve, reject) => {
    onAuthStateChanged(
      auth,
      (user) => {
        resolve(user);
      },
      (e) => reject(e)
    );
  });

export { auth, currentUserPromise, db };