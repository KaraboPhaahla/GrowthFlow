import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const params =
new URLSearchParams(window.location.search);

const businessID =
params.get("business");

const source =
params.get("source") || "Website";

const clinicName =
document.getElementById("clinicName");

loadClinic();

async function loadClinic(){

    if(!businessID){

        clinicName.innerHTML =
        "Clinic Not Found";

        return;

    }

    const businessRef = doc(
        db,
        "businesses",
        businessID
    );

    const businessSnap =
    await getDoc(businessRef);

    if(businessSnap.exists()){

        const business =
businessSnap.data();

clinicName.innerHTML =
business.businessName;

document.getElementById("clinicAddress").innerHTML =
business.address || "Address not available";

const address =
encodeURIComponent(business.address || "");

const map =
document.getElementById("clinicMap");

map.src =
`https://maps.google.com/maps?q=${address}&z=15&output=embed`;

document.getElementById("directionsBtn").href =
`https://www.google.com/maps/search/?api=1&query=${address}`;

    }

    else{

        clinicName.innerHTML =
        "Clinic Not Found";

    }

}

const bookingForm =
document.getElementById("bookingForm");

const successMessage =
document.getElementById("successMessage");

bookingForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const lead = {

    name:
    document.getElementById("name").value,

    phone:
    document.getElementById("phone").value,

    email:
    document.getElementById("email").value,

    service:
    document.getElementById("service").value,

    followUpDate:
    document.getElementById("preferredDate").value,

    notes:
    document.getElementById("notes").value,

    source:source,

    status:"New",

    priority:"Medium",

    createdAt:
    serverTimestamp()

};

    await addDoc(

        collection(
            db,
            "businesses",
            businessID,
            "leads"
        ),

        lead

    );

    bookingForm.reset();

    bookingForm.classList.add("hidden");

    successMessage.classList.remove("hidden");

});