console.log("LEADS PAGE LOADED");

import {auth,db} from "./firebase.js";


import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {

collection,
addDoc,
getDocs,
serverTimestamp,
doc,
deleteDoc

}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const leadTable =
document.getElementById("leadTable");


const modal =
document.getElementById("leadModal");


const addBtn =
document.getElementById("addLeadBtn");

const cancelLead =
document.getElementById("cancelLead");

console.log(addBtn);


let businessID;



// OPEN MODAL

addBtn.addEventListener("click",()=>{

modal.classList.add("active");

});


cancelLead.addEventListener("click",()=>{


modal.classList.remove("active");


leadForm.reset();


});


onAuthStateChanged(auth,async(user)=>{


if(!user){

window.location="login.html";

return;

}


businessID=user.uid;


loadLeads();

checkOpenForm();

});





// CREATE LEAD


const leadForm =
document.getElementById("leadForm");



leadForm.addEventListener("submit",async(e)=>{


e.preventDefault();



await addDoc(

collection(
db,
"businesses",
businessID,
"leads"
),

{


name:
document.getElementById("leadName").value,


phone:
document.getElementById("leadPhone").value,


email:
document.getElementById("leadEmail").value,


service:
document.getElementById("leadService").value,


source:
document.getElementById("leadSource").value,


status:"New",

priority:
document.getElementById("leadPriority").value,


followUpDate:
document.getElementById("followUpDate").value,


notes:
document.getElementById("leadNotes").value,


createdAt:
serverTimestamp()


}


);



alert("Lead Added");


modal.classList.remove("active");


leadForm.reset();


loadLeads();


});





// LOAD LEADS


async function loadLeads(){


leadTable.innerHTML="";


const snapshot =
await getDocs(

collection(
db,
"businesses",
businessID,
"leads"
)

);



snapshot.forEach((doc)=>{


const lead = doc.data();

const leadID = doc.id;



leadTable.innerHTML +=`

<tr>

<td>${lead.name}</td>

<td>${lead.service}</td>

<td>${lead.source}</td>

<td>

<span class="status">

${lead.status}

</span>

</td>

<td>

<button
class="deleteBtn"
data-id="${leadID}">

🗑 Delete

</button>

</td>

</tr>

`;


});

const deleteButtons =
document.querySelectorAll(".deleteBtn");

deleteButtons.forEach(button=>{

button.addEventListener("click",async()=>{

const confirmDelete =
confirm("Delete this lead permanently?");

if(!confirmDelete) return;

await deleteDoc(

doc(
db,
"businesses",
businessID,
"leads",
button.dataset.id
)

);

loadLeads();

});

});

}

function checkOpenForm(){

const params =
new URLSearchParams(window.location.search);


const openForm =
params.get("openForm");


if(openForm === "true"){

modal.classList.add("active");

}

}