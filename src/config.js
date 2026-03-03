import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDDZA1gf3_vVgBic6CGllHdPccEFgzTCIc",
  authDomain: "mickqz.firebaseapp.com",
  projectId: "mickqz",
  storageBucket: "mickqz.firebasestorage.app",
  messagingSenderId: "696008829631",
  appId: "1:696008829631:web:d56a7079e5cd49e21bb40a",
  measurementId: "G-7BT5480M0T",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
