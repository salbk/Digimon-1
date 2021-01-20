<template>
  <div>
    <!--come risolvere prob "oops": mettere spinner finche non si carica la pagina e poi direttamente le card,
    abbiamo provato ma non riuscite
    qui risolto per icone-->
      <md-dialog-alert
      :md-active.sync="alert"
      md-content="Hai già raggiunto il numero massimo di 5 Digimon per squadra!"
      md-confirm-text="Chiudi"/>  

    <md-empty-state
      md-rounded
      md-icon="favorite"
      md-label="Nessun preferito"
      md-description="Ops! Non hai ancora aggiunto alcun preferito!"
      class="md-layout-item md-size-33 md-medium-size-45 md-small-size-50 md-xsmall-size-100"
      v-if="likes == 0"> <!-- mostrato solo se non sono presenti like -->
    </md-empty-state>

    <div v-if="likes != 0" class="md-layout md-gutter">

      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="like in likes"
        :key="like.name"
        @click="DigimonInfo(like.name)"> <!-- card generate con un ciclo v-for
        per ogni elemento nell'array likes, genera un oggetto like. come key il name perché univoco.
        con un click si va alla pagina di info del digimon -->

        <md-card md-with-hover>

          <md-card-media>
            <img :src="like.img" />
          </md-card-media>

          <md-card-header>
            <div class="md-title">{{ like.name }}</div>
            <div class="md-subhead">{{ like.level }}</div>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="liked(like.name)" onclick="event.stopPropagation()">
              <md-icon>favorite</md-icon>
              <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
              <!-- nella pagina dei preferiti solo cuore pieno perché possiamo solo toglierlo -->
            </md-button>
            
            <md-button class="md-icon-button" @click="team(like.name)" onclick="event.stopPropagation()">
                <md-icon v-if="teams.includes(like.name)">playlist_add_check</md-icon>
                <md-icon v-else>playlist_add</md-icon>
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
                <!-- se il digimon che ha il like è anche nel team lo mostra (teams.includes), sennò
                permette di aggiungerlo -->
            </md-button>
          </md-card-actions>

        </md-card>
        
      </div>
    </div>
  </div>
</template>

<script>
import dataservice from "../dataservice";
export default {
  name: 'EmptyStateRounded',
  data: function () {
    return {
      likes: [],
      teams: [],
      alert: false,
    };
  },
  created: function () {
    this.load();
  },
  methods: {
    load() {
      this.likes = []; //svuota ogni volta l'array
      dataservice.controllike().then((data) => { //(cosa?) viene riempito con il controllike
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.likes.push(data.data[0]); //ogni digimon appartenente al nome utente viene inserito nell'array likes
          });
        });
      });
      this.teams = []; //svuota l'array
      dataservice.controlteam().then((data) => {
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.teams.push(data.data[0].name);
          });
        });
      });
    },
    remove(arr, value) { //roba aggiunta per non far passare un sec quando metti/togli like e serve solo per il like
      var i = 0; //si prende indice a caso
      while (i < arr.length) { 
        if (arr[i] === value) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }
    return arr; //prima svuotavi tutto l'array e poi ripopolavi, adesso fa direttamente sull'array
    },
    removelike(arr, value) {   //questa per l'icona cuore
      var i = 0; 
      while (i < arr.length) {
        if (arr[i].name === value) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }
    return arr;  
    },
    liked(name) {
      dataservice.removelike(name);
      setTimeout(() => {
        this.likes = this.removelike(this.likes,name);
      }, 500) //timeout perché il sito ricarica la pagina più velocemente della rimozione del like
    },
    team(name){
      if (this.teams.includes(name)) {
        dataservice.removeteam(name)
        this.teams = this.remove(this.teams,name)
      }
      else {
        if (this.teams.length === 5) {
          this.alert=true;
        }
        else {
          dataservice.team(name)
          this.teams.push(name)
        } 
      }
    },
  },
};
</script>

<style>
.md-card {
  margin: 10px;
}
</style>