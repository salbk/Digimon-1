import axios from "axios";
import firebase from "@firebase/app";
import "@firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyCDOdySJCWsgjWNG28modwC20YC5QUHwfs",
  authDomain: "digimon-55479.firebaseapp.com",
  projectId: "digimon-55479",
  storageBucket: "digimon-55479.appspot.com",
  messagingSenderId: "649353348077",
  appId: "1:649353348077:web:04f91e8540ecd1d1769de4",
  measurementId: "G-0KT7WJ7VVJ"
};
// Initialize Firebase
!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig).firestore()
  : firebase.app().firestore();

var db = firebase.firestore();

var User="";
export default { //ci sono tutte le funzioni
  isAuthenticated() { //ci dice se c'è un elemento username nel localStorage
    return !!localStorage.getItem("username");
  },
  login(username) { //inserisce il campo
    localStorage.setItem("username", username);
  },
  logout() { //toglie il campo
    localStorage.removeItem("username");
  },
  getDigimon() { //prende con axios (libreria per fare richieste a database esterni e restituisce oggetti) i dati dall'api e da la lista digimon
    return axios.get("https://digimon-api.vercel.app/api/digimon");
  },
  getDigimonInfo(name) { //name è una variabile
    return axios.get("https://digimon-api.vercel.app/api/digimon/name/" + name); //name viene concatenato al link -> poi porta alla pagina digimoninfo
  },
  searchDigimon(text) { 
    if (!text || text.length < 3) { //se ci sono meno di 3 lettere non cerca nulla
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return axios
      .get("https://digimon-api.vercel.app/api/digimon/?offset=0&limit=1000")
      .then((data) => {
        return data.data
          .filter((element) => element.name.indexOf(text) >= 0) //filtra elementi tramite il nome
          .map((element) => element.name);
      });
  },
  getUsername() { //variabile che viene richiamata per tutte le funzioni che si collegano al database
    User=localStorage.getItem("username"); //salva l'utente loggato
  },
  like(name) {
    this.getUsername(); //per riempire la variabile like
    return db.collection("likes").doc(name+"-"+User).set({ name:name, user:User });
    // ritorna nella collezione likes un documento nel database con parametri name(digimon) e user(username)
  },
  removelike(name) { //uguale ma lo toglie
    this.getUsername();
    db.collection("likes").doc(name+"-"+User).delete();
  },
  controllike() {
    this.getUsername();
    return db.collection("likes").where("user", "==", User).get().then(data =>  {
      return data.docs.map(doc => doc.data().name) //restituisce i nomi dei digimon che l'utente ha messo
    })
  },
  team(name) {
    this.getUsername();
    return db.collection("teams").doc(name+"-"+User).set({ name:name, user:User });
  },
  removeteam(name) {
    this.getUsername();
    db.collection("teams").doc(name+"-"+User).delete();
  },
  controlteam() {
    this.getUsername();
    return db.collection("teams").where("user", "==", User).get().then(data =>  {
      return data.docs.map(doc => doc.data().name)
    })
  }
}; 

