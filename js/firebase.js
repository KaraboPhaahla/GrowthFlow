// ==========================================
// GROWTHFLOW FIREBASE CONFIG
// KTM TECH
// ==========================================


import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";


import { 
getAuth 
} from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
getFirestore
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";




// YOUR FIREBASE CONFIG GOES HERE


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	
  apiKey: "AIzaSyAwfzEJASY4MG42OcDFTgcFbp_aCpz8r74",
  
  authDomain: "growthflow-ca4c4.firebaseapp.com",
  
  projectId: "growthflow-ca4c4",
  
  storageBucket: "growthflow-ca4c4.firebasestorage.app",
  
  messagingSenderId: "432928020499",
  
  appId: "1:432928020499:web:67e5ca72f7abcf8a7c07e6",
  
  measurementId: "G-PYN4SW7RSS"
};



// INITIALIZE FIREBASE


const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);


export const db = getFirestore(app);

