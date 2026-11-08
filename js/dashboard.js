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
collection,
getDocs,
query,
orderBy,
limit
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const businessName =
document.getElementById("businessName");

const greeting =
document.getElementById("greeting");


const ownerName =
document.getElementById("ownerName");

const totalLeads =
document.getElementById("totalLeads");


const bookedLeads =
document.getElementById("bookedLeads");


const convertedLeads =
document.getElementById("convertedLeads");


const conversionRate =
document.getElementById("conversionRate");

const todayFollowupsCount =
document.getElementById("todayFollowupsCount");

const topLeadSource =
document.getElementById("topLeadSource");

const recentActivity =
document.getElementById("recentActivity");

function loadGreeting(){


const hour =
new Date().getHours();



let message;


if(hour < 12){

message = "Good Morning 👋";

}

else if(hour < 18){

message = "Good Day 👋";

}

else{

message = "Good Evening 👋";

}



greeting.innerHTML = message;


}

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location = "index.html";

return;

}

loadGreeting();

const businessRef =
doc(db,"businesses",user.uid);


const businessSnap =
await getDoc(businessRef);



if(businessSnap.exists()){


const data =
businessSnap.data();


businessName.innerHTML =
data.businessName;


ownerName.innerHTML =
data.ownerName || "Owner";

loadDashboardStats(user.uid);

loadRecentActivity(user.uid);

}


});





const logoutBtn =
document.getElementById("logoutBtn");



logoutBtn.addEventListener("click",async()=>{


await signOut(auth);


window.location = "index.html";


});

async function loadDashboardStats(uid){



const snapshot = await getDocs(

collection(
db,
"businesses",
uid,
"leads"
)

);



let total = snapshot.size;

let booked = 0;

let converted = 0;

let todayFollowups = 0;

let sources = {};

snapshot.forEach((doc)=>{


const lead = doc.data();

if(lead.source){

    if(sources[lead.source]){

        sources[lead.source]++;

    }
    else{

        sources[lead.source] = 1;

    }

}

const today =
new Date()
.toISOString()
.split("T")[0];


if(lead.followUpDate === today){

    todayFollowups++;

}

if(lead.status === "Booked"){

booked++;

}



if(lead.status === "Converted"){

converted++;

}



});



totalLeads.innerHTML = total;


bookedLeads.innerHTML = booked;


convertedLeads.innerHTML = converted;



let rate = 0;


if(total > 0){

rate =
Math.round((converted / total) * 100);

}


conversionRate.innerHTML =
rate + "%";

todayFollowupsCount.innerHTML =
todayFollowups;

let highestSource = "-";

let highestCount = 0;


for(let source in sources){


    if(sources[source] > highestCount){

        highestCount = sources[source];

        highestSource = source;

    }

}


topLeadSource.innerHTML =
highestSource;

}

async function loadRecentActivity(uid){


const leadsQuery = query(

collection(
db,
"businesses",
uid,
"leads"
),

orderBy(
"createdAt",
"desc"
),

limit(5)

);



const snapshot =
await getDocs(leadsQuery);



recentActivity.innerHTML = "";



snapshot.forEach((doc)=>{


const lead = doc.data();



const activity =
document.createElement("div");


activity.className =
"activity";



activity.innerHTML = `

<strong>
${lead.name || "New lead"}
</strong>

<p>
🦷 ${lead.service || "Service"}
</p>

<p>
Status:
${lead.status || "New"}
</p>

`;



recentActivity.appendChild(activity);


});


}

const addLeadBtn =
document.getElementById("addLeadBtn");

const pipelineBtn =
document.getElementById("pipelineBtn");

const followupsBtn =
document.getElementById("followupsBtn");

const viewLeadsBtn =
document.getElementById("viewLeadsBtn");


addLeadBtn.addEventListener("click",()=>{

window.location="leads.html?openForm=true";

});


pipelineBtn.addEventListener("click",()=>{

    window.location="pipeline.html";

});


followupsBtn.addEventListener("click",()=>{

    window.location="followups.html";

});


viewLeadsBtn.addEventListener("click",()=>{

    window.location="leads.html";

});
