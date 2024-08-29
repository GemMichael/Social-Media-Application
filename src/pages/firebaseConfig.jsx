// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBRn4VH_Dys0gv01InPujSPxcGmRjrb2c",
  authDomain: "chizmiz-faefd.firebaseapp.com",
  projectId: "chizmiz-faefd",
  storageBucket: "chizmiz-faefd.appspot.com",
  messagingSenderId: "1086365969084",
  appId: "1:1086365969084:web:b823e432232f3f4a6f7eb9",
  measurementId: "G-E7GFCWJK52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;