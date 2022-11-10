import {getAppoint, saveAppoint, onDelete, onDeleteRes, getReserves} from './app.js';

//Elementos generales de la pagina
let form = document.querySelector('form');
let name = document.querySelector('#name');
let hour = document.querySelector('#hour');
let date = document.querySelector('#date');
let consultations = document.querySelector('#consultations');

//Tablon de reservas
let dateRes = document.getElementById("dateRes");
let resTab = document.getElementById("reserved");

//Funciones event listener
date.addEventListener('change', showConsultations);
form.addEventListener('submit', addConsultations);
dateRes.addEventListener('change', showReserves);

//Cargando información de db
let querySnapshotApp = await getAppoint();
let querySnapshotRes = await getReserves();

// Ordenamiento de horas (menor a mayor)
function hourOrder (dataToOrder){
     const compareStrings = (a, b)=>{return a.length-b.length;}
     let arr = [];

     dataToOrder.forEach((doc) => {arr.push((doc.data().hora));});
     arr.sort(); // <--aquí estamos ordenando de menor a mayor
     arr.sort(compareStrings);

     let dataArr = new Set(arr)
     let setArr = [...dataArr];
     return setArr;
}

//Agregamos horas para reservar
async function addConsultations(e) {
     e.preventDefault();
     let dateId = ""+Date.now();
     saveAppoint(name.value, hour.value, date.value, dateId)
     querySnapshotApp = await getAppoint();
     showConsultations();
}

//Mostramos las horas para reservar
async function showConsultations() {
     
     let htmlData =``;
     //Revisamos la información cargada de db y la agregamos al DOM

     let appointHour = hourOrder (querySnapshotApp);
     for (let hour of appointHour){
     querySnapshotApp.forEach((doc) => {
         
          if (date.value == doc.data().fecha && hour == doc.data().hora){
          htmlData+=`<div class="row border m-2"> 
                         <p class="p-2 col-5"><b>Doctor:</b> ${doc.data().barbero}</p>
                         <p class="p-2 col-4"><b>Hora:</b> ${doc.data().hora}</p>
                         <button class="p-2 m-2 col-2 buttonApp" id="${doc.data().id}"
                         style="height: 40px">Borrar</button></div>`;
               }
          });
     }
     //Efectivamente cargamos la información al dom aquí
     consultations.innerHTML = htmlData;

     //Botones de delete de las horas nuevas
     const btnsDelete= document.querySelectorAll('.buttonApp')
        btnsDelete.forEach(btn=> {
            btn.addEventListener('click',async () =>{
               await onDelete(btn.id);
               querySnapshotApp = await getAppoint();
               showConsultations();
          });
     });         
}

//Mostramos las horas reservadas
async function showReserves (){

     let htmlData =``;
     let reservedHour = hourOrder (querySnapshotRes);
     for (let hour of reservedHour){
     querySnapshotRes.forEach((doc) => {
          if (dateRes.value == doc.data().fecha && hour == doc.data().hora){
               htmlData+=`<div class="row">
                         <p class="pr-2 col-3"><b>Cliente:</b> ${doc.data().cliente}</p> 
                         <p class="pr-2 col-2"><b>Hora:</b> ${doc.data().hora}</p>
                         <p class="pr-2 col-3"><b>Info:</b> ${doc.data().info}</p>
               <button class="p-2 m-2 col-2 buttonRes" id="${doc.data().id}"
               style="height: 40px">Borrar</button></p></div> <hr>`;
          }
      });
     }
     resTab.innerHTML = htmlData;
}

//Recolector de basura (eliminando dtos de fechas anteriores)
function dateGarbageCollector (){
     //creamos un valor de fecha del dia para comparación 
     let d = new Date().getTime();
     //desde aquí, borramos como desquiciaos
     querySnapshotApp.forEach((doc) => {
          let dA = new Date(doc.data().fecha).getTime();
          if (d > (dA+100000000)){
               onDelete(doc.data().id);
          }
     })
     querySnapshotRes.forEach((doc) => {
          let dA = new Date(doc.data().fecha).getTime();
          if (d > (dA+100000000)){
               onDeleteRes(doc.data().id);
          }
     })
}
dateGarbageCollector();
