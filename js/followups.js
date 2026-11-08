import { auth, db } from "./firebase.js";


import { 
    onAuthStateChanged 
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
    collection,
    getDocs,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const todayContainer =
document.getElementById("todayFollowups");


const overdueContainer =
document.getElementById("overdueFollowups");


const completedContainer =
document.getElementById("completedFollowups");



let businessID;



onAuthStateChanged(auth, async(user)=>{


    if(!user){

        window.location = "index.html";

        return;

    }


    businessID = user.uid;


    loadFollowUps();


});




async function loadFollowUps(){

    console.log("Follow-ups system loaded");

    todayContainer.innerHTML = "";
overdueContainer.innerHTML = "";
completedContainer.innerHTML = "";

    const snapshot = await getDocs(

        collection(
            db,
            "businesses",
            businessID,
            "leads"
        )

    );


    console.log("Total leads found:", snapshot.size);


snapshot.forEach((leadDoc)=>{


    const lead = leadDoc.data();


    displayFollowUp(
        leadDoc.id,
        lead
    );


});


}
function displayFollowUp(leadId, lead){


    const card = document.createElement("div");


    card.className = "followup-card";


    card.innerHTML = `

        <h3>
        ${lead.name || "Unknown Patient"}
        </h3>


        <p>
        🦷 ${lead.service || "Service not selected"}
        </p>


        <p>
        📱 ${lead.source || "Unknown source"}
        </p>


        <p>
        ☎️ ${lead.phone || "No phone number"}
        </p>


        <p>
📅 Follow-up:
${lead.followUpDate || "Not set"}
</p>

<div class="followup-actions">

<button class="callBtn">
📞 Call
</button>

<button class="whatsappBtn">
💬 WhatsApp
</button>

<button class="bookBtn">
📅 Book Appointment
</button>

<button class="completeBtn">
✅ Complete
</button>

</div>


    `;

   const callBtn = card.querySelector(".callBtn");
const whatsappBtn = card.querySelector(".whatsappBtn");
const completeBtn = card.querySelector(".completeBtn");
const bookBtn =
card.querySelector(".bookBtn");

callBtn.addEventListener("click", () => {

    if(lead.phone){

        window.location.href = `tel:${lead.phone}`;

    }else{

        alert("No phone number available.");

    }

});

whatsappBtn.addEventListener("click", () => {

    if(lead.phone){

        const phone = lead.phone.replace(/\D/g,"");

        window.open(
            `https://wa.me/27${phone.substring(1)}`,
            "_blank"
        );

    }else{

        alert("No phone number available.");

    }

});

bookBtn.addEventListener("click",()=>{


sessionStorage.setItem(

"selectedLead",

JSON.stringify({

id:leadId,

name:lead.name,

phone:lead.phone,

service:lead.service,

source:lead.source

})

);


window.location="appointments.html";


});

completeBtn.addEventListener("click", async () => {

    await markComplete(leadId);

});

    if(lead.status === "Converted"){

        completedContainer.appendChild(card);

    }


    else if(lead.followUpDate){


        const today =
        new Date()
        .toISOString()
        .split("T")[0];


        if(lead.followUpDate === today){

            todayContainer.appendChild(card);

        }


        else if(lead.followUpDate < today){

            overdueContainer.appendChild(card);

        }


    }


}

async function markComplete(leadId){

    const leadRef = doc(
        db,
        "businesses",
        businessID,
        "leads",
        leadId
    );

    await updateDoc(leadRef,{
        status:"Converted"
    });

    loadFollowUps();

}



