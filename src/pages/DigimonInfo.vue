<template>
  <div class="md-layout">
    
    <md-dialog-alert
      :md-active.sync="alert"
      md-content="Hai già raggiunto il numero massimo di 5 Digimon per squadra!"
      md-confirm-text="Chiudi"/>  

    <md-card class="md-layout-item md-size-100" v-if="Digimon"> <!-- v-if controllo inutile -->

      <md-card-header>
        <md-card-header-text>
          <span class="md-title">{{ Digimon.name }}</span> <!-- Digimon->oggetto name, img, level ->dati API per prendere dati dentro oggetti -> . -->
        </md-card-header-text>

        <md-card-media class="md-big">
          <img :src="Digimon.img">
        </md-card-media>
      </md-card-header>

      <md-card-content>
        <span>{{ Digimon.level }}</span>
      </md-card-content>
       
      <md-card-actions> 

            <md-button class="md-icon-button" @click="likes()" onclick="event.stopPropagation()"> <!-- stopPropagation ->evita che si clicchi tutta la card -->
                <md-icon v-if="like==true">favorite</md-icon> <!-- like variabile nei data, se è vera cuore pieno, sennò vuoto -->
                <md-icon v-else>favorite_border</md-icon>
                <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
            </md-button>
            
            <md-button class="md-icon-button" @click="teams()" onclick="event.stopPropagation()"> <!-- vedi sopra -->
                <md-icon v-if="team==true">playlist_add_check</md-icon>
                <md-icon v-else>playlist_add</md-icon> 
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
            </md-button> 
      
      </md-card-actions>

    </md-card>
  </div>
</template>

<script>
import dataservice from "../dataservice";

export default {
  data: function () {
    return {
      Digimon: null, //perché è null?
      like: false,
      team: false,
      squadra: [],
      alert: false,
    };
  },
  watch: {
    $route: function () {
      this.load();
    },
  },
  created: function () { //quando si crea la pagina si deve ricaricare con load(presente nei methods)
    this.load();
  },
  methods: {
    load: function () {
      dataservice.getDigimonInfo(this.$route.params.name).then((data) => { //router CHIARA
      /*quando si ricarica la pagina prendiamo getDigimonInfo da dataservice e passiamo tra () il nome effettivo
      del digimon prendendolo dal router*/
        this.Digimon = data.data[0]; 
      });
      dataservice.controllike().then(data => {
        if (data.includes(this.$route.params.name)) { //se include il nome del digimon selezionato, il like c'è
          this.like=true
        }
      });
      dataservice.controlteam().then(data => { //ugale a sopra
        this.squadra = data; //perché dobbiamo controllare quanti elementi ci sono in squadra                perchè qua array sì e sopra (likes) no?? forse xk max 5? maybe or maybe not  so call me maybe 
        if (data.includes(this.$route.params.name)) {
          this.team=true //pirla, nice <3
        }
      });
    },
    likes: function () {
      if (this.like === false) { //se il like non c'è
        dataservice.like(this.$route.params.name); //richiamiamo la variabile dal dataservice
        this.like=!this.like; //inverte il valore della variabile
      } else {
        dataservice.removelike(this.$route.params.name); //se la variabile è true, rimuovi il like
        this.like=!this.like;
      }   
    },
    teams: function () {
      if (this.team === false) { //se il team non c'è
        if (this.squadra.length === 5) { //se ci sono già 5 elementi
          this.alert=true; //mostra l'alert
        }
        else { //sennò permette di aggiungere l'elemento al team
          dataservice.team(this.$route.params.name)
          this.team=!this.team;
        } 
      } else { //se è già presente nel team, permette di toglierlo
        dataservice.removeteam(this.$route.params.name);
        this.team=!this.team;
      }   
    }
  }
}
</script>

<style>

</style>