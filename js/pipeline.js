import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const newLeads = document.getElementById("newLeads");
const contactedLeads = document.getElementById("contactedLeads");
const followUpLeads = document.getElementById("followUpLeads");
const bookedLeads = document.getElementById("bookedLeads");
const convertedLeads = document.getElementById("convertedLeads");

let businessID;

let counts = {

    New:0,

    Contacted:0,

    "Follow-up":0,

    Booked:0,

    Converted:0

};

let sources = {

    Facebook:0,

    TikTok:0,

    WhatsApp:0,

    Referral:0,

    Website:0

};

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location = "login.html";
        return;
    }

    businessID = user.uid;

    await loadPipeline();

});

async function loadPipeline() {

    counts = {

    New:0,

    Contacted:0,

    "Follow-up":0,

    Booked:0,

    Converted:0

};

sources = {

    Facebook:0,

    TikTok:0,

    WhatsApp:0,

    Referral:0,

    Website:0

};

    newLeads.innerHTML = "";

contactedLeads.innerHTML = "";

followUpLeads.innerHTML = "";

bookedLeads.innerHTML = "";

convertedLeads.innerHTML = "";

    const snapshot = await getDocs(
        collection(db, "businesses", businessID, "leads")
    );

    snapshot.forEach((leadDoc)=>{


const lead = leadDoc.data();


counts[lead.status]++;

if(sources[lead.source] !== undefined){

    sources[lead.source]++;

}

createCard(
leadDoc.id,
lead
);


});

updateCounters();

updateSourceCounters();

}

function createCard(leadId, lead){

    const card = document.createElement("div");

    card.className = "lead-card";

    card.innerHTML = `
        <h4>${lead.name}</h4>

        <p>🦷 ${lead.service}</p>

        <p>📱 ${lead.source}</p>

        <p><strong>Priority:</strong> ${lead.priority}</p>

        <p><strong>Follow-up:</strong> ${lead.followUpDate || "Not set"}</p>

        <select class="statusSelect">

            <option value="New" ${lead.status==="New"?"selected":""}>
                New
            </option>

            <option value="Contacted" ${lead.status==="Contacted"?"selected":""}>
                Contacted
            </option>

            <option value="Follow-up" ${lead.status==="Follow-up"?"selected":""}>
                Follow-up
            </option>

            <option value="Booked" ${lead.status==="Booked"?"selected":""}>
                Booked
            </option>

            <option value="Converted" ${lead.status==="Converted"?"selected":""}>
                Converted
            </option>

        </select>
`;


// ADD THIS
const statusSelect =
    card.querySelector(".statusSelect");


// THEN THIS

statusSelect.addEventListener("change", async () => {


    await updateLeadStatus(
        leadId,
        statusSelect.value
    );


});

    switch(lead.status){

        case "New":
            newLeads.appendChild(card);
            break;

        case "Contacted":
            contactedLeads.appendChild(card);
            break;

        case "Follow-up":
            followUpLeads.appendChild(card);
            break;

        case "Booked":
            bookedLeads.appendChild(card);
            break;

        case "Converted":
            convertedLeads.appendChild(card);
            break;

        default:
            newLeads.appendChild(card);

    }

}

async function updateLeadStatus(leadId, newStatus){

    const leadRef = doc(
        db,
        "businesses",
        businessID,
        "leads",
        leadId
    );


    await updateDoc(
        leadRef,
        {
            status:newStatus
        }
    );


    loadPipeline();

}

function updateCounters(){


document.getElementById("newCount").innerText =
counts.New;


document.getElementById("contactedCount").innerText =
counts.Contacted;


document.getElementById("followUpCount").innerText =
counts["Follow-up"];


document.getElementById("bookedCount").innerText =
counts.Booked;


document.getElementById("convertedCount").innerText =
counts.Converted;


}

function updateSourceCounters(){


document.getElementById("facebookCount").innerText =
sources.Facebook + " Leads";


document.getElementById("tiktokCount").innerText =
sources.TikTok + " Leads";


document.getElementById("whatsappCount").innerText =
sources.WhatsApp + " Leads";


document.getElementById("referralCount").innerText =
sources.Referral + " Leads";


document.getElementById("websiteCount").innerText =
sources.Website + " Leads";


}

