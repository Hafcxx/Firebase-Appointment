// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js';
import { addDoc, 
  collection, 
  getFirestore, 
  getDocs, 
  onSnapshot,
  deleteDoc, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query, where } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore();

//Llamando info db horas para reservar
export const getAppoint = () => getDocs (collection(db, 'horasParaReserva'));

//guardando horas en db
export const saveAppoint = async (name, horaVar, dateVar, idVar) =>{
  await setDoc(doc(db, 'horasParaReserva', idVar), {barbero: name, hora: horaVar, fecha: dateVar, reservada: false, id: idVar});
}

//borrando info
export const onDelete = id => deleteDoc(doc(db,'horasParaReserva', id))

//updateando info
export const updateAppoint = (id, newFields)=> updateDoc(doc(db,'horasParaReserva', id),newFields)

//guardando informacion de las reservas
export const saveReserve = async (name, tel, horaVar, dateVar, inf, idVar) =>{
  await setDoc(doc(db, 'horasReservadas', idVar), {cliente: name, telefono: tel, fecha: dateVar, info: inf, hora: horaVar, id: idVar, estado: "Reservada"});
}

//llamamos a la inforamcion de reservas
export const getReserves = () => getDocs (collection(db, 'horasReservadas'));

//borrando info de reservadas
export const onDeleteRes = id => deleteDoc(doc(db,'horasReservadas', id))
