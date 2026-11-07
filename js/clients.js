console.log("Clients JS loaded");
import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
    collection,
    getDocs
}
from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const clientCount =
document.getElementById("clientCount");

const clientsTableBody =
document.getElementById("clientsTableBody");

const searchClient =
document.getElementById("searchClient");

console.log(searchClient);

const logoutBtn =
document.getElementById("logoutBtn");

let businessID;

let clients = [];

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location="login.html";

        return;

    }

    businessID = user.uid;

    loadClients();

});

async function loadClients(){

    const snapshot = await getDocs(

        collection(
            db,
            "businesses",
            businessID,
            "leads"
        )

    );

    clients = [];

    snapshot.forEach((doc)=>{

        const lead = doc.data();

        if(lead.status === "Converted"){

            clients.push(lead);

        }

    });

     console.log(clients);

    clients.sort((a,b)=>{

const dateA =
a.createdAt
? a.createdAt.toMillis()
:0;

const dateB =
b.createdAt
? b.createdAt.toMillis()
:0;

return dateB-dateA;

});

    displayClients(clients);

}

function displayClients(clientList){

    clientsTableBody.innerHTML = "";

    clientCount.innerText = `Total Clients: ${clientList.length}`;

    clientList.forEach((client)=>{

        const row =
        document.createElement("tr");

        row.innerHTML = `

        <td>${client.name || "-"}</td>

        <td>${client.phone || "-"}</td>

        <td>${client.service || "-"}</td>

        <td>${client.source || "-"}</td>

        <td>${
            client.createdAt
            ? client.createdAt.toDate().toLocaleDateString()
            : "-"
        }</td>

        `;

        clientsTableBody.appendChild(row);

    });

}



if(searchClient){

searchClient.addEventListener("input",()=>{


const value =
searchClient.value.toLowerCase();


const filtered =
clients.filter(client=>{

return(

(client.name || "")
.toLowerCase()
.includes(value)

||

(client.phone || "")
.toLowerCase()
.includes(value)

||

(client.service || "")
.toLowerCase()
.includes(value)

);

});


displayClients(filtered);


});

}