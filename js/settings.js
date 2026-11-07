import { auth, db } from "./firebase.js";


import {
onAuthStateChanged,
signOut
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
doc,
getDoc,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form =
document.getElementById("settingsForm");


const businessNameInput =
document.getElementById("businessNameInput");

const ownerNameInput =
document.getElementById("ownerNameInput");

const phoneInput =
document.getElementById("phoneInput");


const emailInput =
document.getElementById("emailInput");


const addressInput =
document.getElementById("addressInput");



let businessID;



onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location="login.html";

        return;

    }

    businessID = user.uid;

    loadSettings();

    const baseURL = window.location.origin;

    document.getElementById("facebookLink").value =
    `${baseURL}/book.html?business=${user.uid}&source=Facebook`;

    document.getElementById("instagramLink").value =
    `${baseURL}/book.html?business=${user.uid}&source=Instagram`;

    document.getElementById("whatsappLink").value =
    `${baseURL}/book.html?business=${user.uid}&source=WhatsApp`;

    document.getElementById("websiteLink").value =
    `${baseURL}/book.html?business=${user.uid}&source=Website`;

});

async function loadSettings(){


const businessRef =
doc(
db,
"businesses",
businessID
);


const snapshot =
await getDoc(businessRef);



if(snapshot.exists()){


const data =
snapshot.data();



businessNameInput.value =
data.businessName || "";

ownerNameInput.value =
data.ownerName || "";

phoneInput.value =
data.phone || "";


emailInput.value =
data.email || "";


addressInput.value =
data.address || "";


}



}



form.addEventListener("submit",async(e)=>{


e.preventDefault();



await updateDoc(

doc(
db,
"businesses",
businessID
),

{

businessName:
businessNameInput.value,


ownerName:
ownerNameInput.value,


phone:
phoneInput.value,


email:
emailInput.value,


address:
addressInput.value

}

);



alert("Settings updated successfully");


});



const logoutBtn =
document.getElementById("logoutBtn");


if(logoutBtn){

    logoutBtn.addEventListener("click",async()=>{

        await signOut(auth);

        window.location="login.html";

    });

} 
console.log(document.getElementById("copyFacebook"));

// ==========================
// Copy Marketing Links
// ==========================

async function copyLink(inputId){

    const input =
    document.getElementById(inputId);


    await navigator.clipboard.writeText(
        input.value
    );


    alert("Link copied successfully!");

}

const copyButtons =
document.querySelectorAll(".copyBtn");


copyButtons.forEach(button=>{


button.addEventListener("click",()=>{


const inputId =
button.dataset.link;


copyLink(inputId);


});


});

const testButtons =
document.querySelectorAll(".testBtn");


testButtons.forEach(button=>{


button.addEventListener("click",()=>{


const inputId =
button.dataset.link;


const url =
document.getElementById(inputId).value;


window.open(url,"_blank");


});


});

const qrButtons =
document.querySelectorAll(".qrBtn");


qrButtons.forEach(button=>{


button.addEventListener("click",()=>{


const linkID =
button.dataset.link;


const qrID =
button.dataset.qr;



const url =
document.getElementById(linkID).value;



const qrContainer =
document.getElementById(qrID);



qrContainer.innerHTML = "";



new QRCode(
qrContainer,
{

text:url,

width:150,

height:150

}

);

const actions =
document.getElementById(
    qrID.replace("QR","Actions")
);


if(actions){

    actions.classList.remove("hidden");

}



});


});

const downloadButtons =
document.querySelectorAll(".downloadQRBtn");


downloadButtons.forEach(button=>{


button.addEventListener("click",()=>{


const qrID =
button.dataset.qr;


const qr =
document
.getElementById(qrID)
.querySelector("img");


if(!qr){

alert("Generate the QR code first.");

return;

}


const link =
document.createElement("a");


link.href = qr.src;

link.download =
"GrowthFlow-QR-Code.png";


link.click();


});


});

const printButtons =
document.querySelectorAll(".printQRBtn");


printButtons.forEach(button=>{


button.addEventListener("click",()=>{


const qrID =
button.dataset.qr;


const qrContent =
document.getElementById(qrID).innerHTML;



const printWindow =
window.open("","_blank");


printWindow.document.write(`

<html>

<body style="text-align:center">

<h2>Scan to Book Appointment</h2>

${qrContent}

<p>
Powered by GrowthFlow
</p>

</body>

</html>

`);


printWindow.print();


});


});






