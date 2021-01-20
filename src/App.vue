<template>
  <div id="app" class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible" v-if="authenticated"> 
        <!-- al click modifica la variabile e mostra il menu, v-if è per le condizioni, v-for per i cicli -->
          <md-icon>menu</md-icon>
        </md-button>
        <span @click="homepage()" class="md-layout-item md-small"> <!--span è un elemento inline, div a livello di blocco -->
          <img src="./assets/logoDigimon.png" width="100" />
        </span>

        <div class="md-toolbar-section-end" v-if="authenticated"> 
          <md-autocomplete
            class="searchbar" 
            md-layout="box"
            v-model="selectedDigimon"  
            :md-options="searchOptions"
            @md-changed="search"
            @md-selected="select"> 
<!-- v-model: si collega all'elemento che poi selezioni (selectedDigimon->variabile) si trova nei data CHIARA
:md-options: searchOptions array nei data, cerca opzioni dall'API si trova nei data
@md-changed: ogni volta che si inserisce una lettera si collega alla funzione search, md-selected si collega al select
per far vedere il digimon  (sono funzioni che si trovano nei methods)-->

            <label> 
              <md-icon>search</md-icon>
               Cerca Digimon 
            </label>

          </md-autocomplete>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" class="drawer"> <!-- sincronizzato alla variabile menuVisible -->
        <md-toolbar class="md-transparent" md-elevation="0">
          <b>Ciao, {{username}}! </b>
        </md-toolbar>

        <md-list> <!-- elenco che porta alle diverse pagine -->
          <md-list-item to="/#">
            <md-icon>list_alt</md-icon>
            <span class="md-list-item-text">Lista Digimon</span>
          </md-list-item>

          <md-list-item to="/Squadra">
            <md-icon>groups</md-icon>
            <span class="md-list-item-text">Squadra</span>
          </md-list-item>

          <md-list-item to="/Preferiti">
            <md-icon>favorite</md-icon>
            <span class="md-list-item-text">Preferiti</span>
          </md-list-item>

          <md-list-item to="/AboutDigimon">
            <md-icon>info</md-icon>
            <span class="md-list-item-text">About Digimon</span>
          </md-list-item>

          <br>
          <md-divider></md-divider>
          <br>

          <md-list-item @click="logout()">
            <md-icon>logout</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content class="md-accent"> <router-view></router-view> </md-app-content>
    </md-app>
  </div>
</template>

<script>
import dataservice from "./dataservice";
export default {
  name: "App",
  data: function () { //sezione in cui ci sono tutte le variabili e gli array
    return {
      authenticated: dataservice.isAuthenticated(),
      selectedDigimon: null, //variabile, è null perché non c'è nessun digimon selezionato
      searchOptions: [], //array, prende i dati da searchDigimon che è nel dataservice
      menuVisible: false, //variabile, è false perché parte chiuso (true quando viene cliccato)
      username: "", //variabile
    };
  },
  watch: { //guarda i cambiamenti del router, ogni volta che c'è una modifica ricarica automaticamente la pagina
    $route: function () {
      this.authenticated = dataservice.isAuthenticated();
      this.username="";
      this.username=localStorage.getItem("username");
    },
  },
  methods: { //sono le vere e proprie funzioni che vengono richiamate sopra
    capitalizeFirstLetter:function(string) { //definisce la funzione capitalizeFirstLetter
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    search: function (term) {
      this.searchOptions = dataservice.searchDigimon(this.capitalizeFirstLetter(term));
    }, //this.searchOption = array, cerca i digimon nel dataservice, passa il nome scritto dall'utente con 1 lettera maiuscola
    select: function (selected) {
      if (selected === this.$route.params.name) return; //se l'elemento selezionato è ugale a quello del router -> fa return (non succede nulla)
      this.$router.push({ //se è un altro, cambia il path e diventa info + digimon selezionato
        path: "/info/" + selected, //ciò che si vede nella barra in alto
      });
    },
    logout: function () {
      dataservice.logout(); //si collega al dataservice
      this.$router.push({ //si collega al router
        path: "/login", //va alla pagina di login
      });
    },
    homepage: function () {
      if (dataservice.isAuthenticated()){ //funzione che c'è nel logo digimon, funziona solo se autenticati, riporta alla pagina principale
        this.$router.push({
        path: "/#",
        });
      }
      
    },
  },
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme(
  "default",
  (
    primary: #ec7200,
    // The primary color of your application
      accent: #A7DBE8 ,// The accent or secondary color
      
  )
);

@import "~vue-material/dist/theme/all"; // Apply the theme
.searchbar {
  max-width: 200px;
}
.drawer {
  width: 200px;
}
.md-app {
  height: 100vh;
}

</style>
