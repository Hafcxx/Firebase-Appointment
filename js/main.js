import {getAppoint, updateAppoint, saveReserve} from './app.js';

//variables de la pagina
let submitApp = document.getElementById('subAppoint');
let date = document.querySelector('#date');
let consultations = document.querySelector('#consultations');
let client = document.querySelector('#client-name');
let contact = document.querySelector('#contact');
let appForm = document.querySelector('#appForm');

//modal
const modalCorreo = document.getElementById("modalMensaje");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeMsj");
const sendModal = document.getElementById("sendMsj");

//inicializamos sesion storage
sessionStorage.setItem("appointInfo", "");
sessionStorage.setItem("appointId", "");
sessionStorage.setItem("altId", "");
sessionStorage.setItem("appointHour", "");

// Ordenamiento de horas (menor a mayor)
function hourOrder (dataToOrder){

     const compareStrings = (a, b)=>{return a.length-b.length;}

     let arr = [];
     dataToOrder.forEach((doc) => {arr.push((doc.data().hora));});
     arr.sort(); // <--aquí estamos ordenando de menor a mayor
     arr.sort(compareStrings) //;

     let dataArr = new Set(arr)
     let setArr = [...dataArr];
     return setArr;
}

//Generamos el popUp con la información para agregar la consulta
function addConsultations(e) {
     e.preventDefault();
     modalCorreo.style.display = "block";
     let newDateId = ""+Date.now();
     sessionStorage.setItem("altId", newDateId);
     modalText.innerHTML= `
          <p class=><b>Nombre: </b>${client.value} </p>
          <p><b>Tel (+56): </b>${contact.value}</p>
          <p><b>Fecha: </b>${date.value}</p>
          <p><b>Id:</b> ${sessionStorage.getItem("altId")} </p>
          <p><b>${sessionStorage.getItem("appointInfo")}</b></p>`  
}

async function sendingAppoint(){
     updateAppoint(sessionStorage.getItem("appointId"), {reservada: true});
     
     await saveReserve(
          client.value,
          contact.value,
          sessionStorage.getItem("appointHour"),
          date.value,
          sessionStorage.getItem("appointInfo"),
          sessionStorage.getItem("altId")
     );
}

async function showConsultations() {

     //aca mostramos la información cuando se coloca la fecha 
     let htmlData =`<b class="p-2">Fecha: ${date.value}</b>`;
     const querySnapshot = await getAppoint();
     let appointHour = hourOrder (querySnapshot);

     for (let hour of appointHour){
     querySnapshot.forEach((doc) => {

          if (date.value == doc.data().fecha && doc.data().reservada==false && hour == doc.data().hora){
          htmlData+=`<button class="row border m-2 infoBox" value="${doc.data().hora}" style="background-color: LightCyan" id="${doc.data().id}"> 
                    <p class="p-2 col-5 "><b>Doctor:</b> ${doc.data().barbero}</p>
                    <p class="p-2 col-4 "><b>Hora:</b> ${doc.data().hora}</p>
                    </button>`;
          }
     });
     }
     consultations.innerHTML = htmlData;
     
     //aca funciona la lista desplegada de horas
     const savingInfo= document.querySelectorAll('.infoBox')
        savingInfo.forEach(btn=> {
            btn.addEventListener('click',async () =>{
                    turnWhite();
                    let newDateId = ""+Date.now();
                    btn.style.backgroundColor = "Turquoise"
                    sessionStorage.setItem("appointInfo", btn.innerText);
                    sessionStorage.setItem("appointId", btn.id);
                    sessionStorage.setItem("altId", newDateId);
                    sessionStorage.setItem("appointHour", btn.value);
          });
     });
     
     //vuelve todos los demas botones en blanco, no se me ocurrio mejor forma perdon.
     function turnWhite (){
          savingInfo.forEach(btn=> {
               btn.style.backgroundColor = "LightCyan";
     })};
}

//enviamos la información desde el modal
sendModal.addEventListener("click", async ()=>{
     await sendingAppoint();
     modalCorreo.style.display = "none";
     alert ("Muchas Gracias, estaremos en contacto ;)");
     appForm.reset();
     showConsultations();
})

//cerramos el modal.
closeModal.addEventListener("click", ()=>{
     modalCorreo.style.display = "none";
     sessionStorage.setItem("appointInfo", "");
     sessionStorage.setItem("appointId", "");
     sessionStorage.setItem("altId", "");
     sessionStorage.setItem("appointHour", "");
})

date.addEventListener('change', showConsultations);

submitApp.addEventListener('click', addConsultations);
