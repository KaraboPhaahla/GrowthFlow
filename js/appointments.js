import { auth, db } from "./firebase.js";


import {
    onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const modal =
document.getElementById("appointmentModal");


const newAppointmentBtn =
document.getElementById("newAppointmentBtn");


const cancelAppointment =
document.getElementById("cancelAppointment");


const appointmentForm =
document.getElementById("appointmentForm");

const todayAppointments =
document.getElementById("todayAppointments");


const upcomingAppointments =
document.getElementById("upcomingAppointments");

const missedAppointments =
document.getElementById("missedAppointments");

let businessID;

let selectedLead = null;

let editingAppointmentID = null;

onAuthStateChanged(auth,(user)=>{


    if(!user){

        window.location = "index.html";

        return;

    }


    businessID = user.uid;

loadAppointments();

checkSelectedLead();


});





newAppointmentBtn.addEventListener("click",()=>{


editingAppointmentID = null;


document.getElementById("appointmentTitle").innerText =
"New Appointment";


modal.classList.remove("hidden");


});





cancelAppointment.addEventListener("click",()=>{


    appointmentForm.reset();


    sessionStorage.removeItem("selectedLead");


    selectedLead = null;


    modal.classList.add("hidden");


});





appointmentForm.addEventListener("submit",async(e)=>{


    e.preventDefault();



    const appointment = {


    leadId:
    selectedLead ? selectedLead.id : null,


    patientName:
    document.getElementById("patientName").value,


    service:
    document.getElementById("service").value,


    dentist:
    document.getElementById("dentist").value,


    date:
    document.getElementById("appointmentDate").value,


    time:
    document.getElementById("appointmentTime").value,


    duration:
    document.getElementById("duration").value,


    notes:
    document.getElementById("notes").value,


    status:"Scheduled",


    createdAt:
    serverTimestamp()

};



    if(editingAppointmentID){


const appointmentRef = doc(

db,

"businesses",

businessID,

"appointments",

editingAppointmentID

);


await updateDoc(

appointmentRef,

appointment

);


}
else{


await addDoc(

collection(
db,
"businesses",
businessID,
"appointments"
),

appointment

);


}
    

if(selectedLead && selectedLead.id){


const leadRef = doc(

db,

"businesses",

businessID,

"leads",

selectedLead.id

);


await updateDoc(

leadRef,

{

status:"Booked"

}

);


}

    alert("Appointment saved successfully");


    appointmentForm.reset();

    editingAppointmentID = null;

    modal.classList.add("hidden");


});

async function loadAppointments(){


todayAppointments.innerHTML = "";

upcomingAppointments.innerHTML = "";

missedAppointments.innerHTML = "";



const snapshot = await getDocs(

collection(
db,
"businesses",
businessID,
"appointments"
)

);



const today =
new Date()
.toISOString()
.split("T")[0];



snapshot.forEach((doc)=>{


const appointment = doc.data();



createAppointmentCard(
    doc.id,
    appointment
);



});



}

function createAppointmentCard(
    appointmentId,
    appointment
){


const card =
document.createElement("div");


card.className =
"appointment-card";



card.innerHTML = `

<h3>
${appointment.patientName}
</h3>


<p>
🦷 ${appointment.service}
</p>


<p>
👨‍⚕️ ${appointment.dentist || "Not assigned"}
</p>


<p>
📅 ${appointment.date}
</p>


<p>
🕒 ${appointment.time}
</p>


<p>
Status:
${appointment.status}
</p>

<div class="appointment-actions">

<button class="editBtn">
✏ Edit
</button>

<button class="confirmBtn">
✔ Confirm
</button>

<button class="completeBtn">
✅ Complete
</button>

<button class="cancelBtn">
❌ Cancel
</button>

</div>

`;

const confirmBtn =
card.querySelector(".confirmBtn");

const completeBtn =
card.querySelector(".completeBtn");

const cancelBtn =
card.querySelector(".cancelBtn");

const editBtn =
card.querySelector(".editBtn");

confirmBtn.addEventListener("click",async()=>{

    await updateAppointmentStatus(
        appointmentId,
        "Confirmed"
    );

});

editBtn.addEventListener("click",()=>{


editingAppointmentID = appointmentId;


modal.classList.remove("hidden");



document.getElementById("patientName").value =
appointment.patientName || "";


document.getElementById("service").value =
appointment.service || "";


document.getElementById("dentist").value =
appointment.dentist || "";


document.getElementById("appointmentDate").value =
appointment.date || "";


document.getElementById("appointmentTime").value =
appointment.time || "";


document.getElementById("duration").value =
appointment.duration || "";


document.getElementById("notes").value =
appointment.notes || "";

document.getElementById("appointmentTitle").innerText =
"Edit Appointment";

});

completeBtn.addEventListener("click",async()=>{


    await updateAppointmentStatus(
        appointmentId,
        "Completed",
        appointment
    );


});

cancelBtn.addEventListener("click",async()=>{

    const confirmDelete = confirm(

        "Cancel this appointment?\n\nThis appointment will be removed completely."

    );

    if(!confirmDelete) return;

    await deleteAppointment(
        appointmentId
    );

});

const today =
new Date()
.toISOString()
.split("T")[0];


// Completed appointments disappear
if(appointment.status === "Completed"){

    return;

}


// Today's appointments
if(appointment.date === today){

    todayAppointments.appendChild(card);

}


// Future appointments
else if(appointment.date > today){

    upcomingAppointments.appendChild(card);

}


// Past appointments
else{

    missedAppointments.appendChild(card);

}



}

async function updateAppointmentStatus(
    appointmentId,
    newStatus,
    appointment
){

    const appointmentRef = doc(
        db,
        "businesses",
        businessID,
        "appointments",
        appointmentId
    );

    await updateDoc(
        appointmentRef,
        {
            status:newStatus
        }
    );

    if(
newStatus === "Completed" 
&& appointment.leadId
){


const leadRef = doc(

db,

"businesses",

businessID,

"leads",

appointment.leadId

);


await updateDoc(

leadRef,

{

status:"Converted"

}

);


}

    loadAppointments();

}

async function deleteAppointment(appointmentId){

    const appointmentRef = doc(

        db,
        "businesses",
        businessID,
        "appointments",
        appointmentId

    );

    await deleteDoc(appointmentRef);

    loadAppointments();

}

function checkSelectedLead(){

selectedLead =
JSON.parse(
sessionStorage.getItem("selectedLead")
);


if(!selectedLead){

return;

}


modal.classList.remove("hidden");


document.getElementById("patientName").value =
selectedLead.name || "";


document.getElementById("service").value =
selectedLead.service || "";


document.getElementById("service").value =
selectedLead.service || "";

}
