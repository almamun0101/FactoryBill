// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLcrBCDkNMJPgkTTuwUpB5GKsrqxy2Ijk",
  authDomain: "factorydb.firebaseapp.com",
  databaseURL: "https://factorydb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "factorydb",
  storageBucket: "factorydb.firebasestorage.app",
  messagingSenderId: "1011746367997",
  appId: "1:1011746367997:web:059ec452a48bc50b569194",
  measurementId: "G-H823J53B94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



export default firebaseConfig;