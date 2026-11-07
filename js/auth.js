import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===========================
   REGISTER
=========================== */

const registerForm = document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", async(e)=>{

        e.preventDefault();

        const ownerName=document.getElementById("ownerName").value.trim();
        const businessName=document.getElementById("businessName").value.trim();
        const industry=document.getElementById("industry").value;
        const email=document.getElementById("registerEmail").value.trim();
        const password=document.getElementById("registerPassword").value;

        try{

            const userCredential=await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const uid=userCredential.user.uid;

            // USERS COLLECTION
            await setDoc(doc(db,"users",uid),{

                ownerName,
                email,
                businessId:uid,
                role:"owner",
                createdAt:serverTimestamp()

            });

            // BUSINESSES COLLECTION
            await setDoc(doc(db,"businesses",uid),{

                businessName,
                industry,
                ownerName,
                email,

                phone:"",
                whatsapp:"",
                address:"",
                logo:"",

                createdAt:serverTimestamp()

            });

            alert("🎉 Business created successfully!");

            window.location="dashboard.html";

        }

        catch(error){

            alert(error.message);

        }

    });

}

/* ===========================
   LOGIN
=========================== */

const loginForm=document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit",async(e)=>{

        e.preventDefault();

        const email=document.getElementById("email").value;

        const password=document.getElementById("password").value;

        try{

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.location="dashboard.html";

        }

        catch(error){

            alert(error.message);

        }

    });

}