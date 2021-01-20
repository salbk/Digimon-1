<template>
<div>

  <div>
    <md-empty-state
      md-rounded
      md-icon="groups"
      md-label="Nessuna Squadra"
      md-description="Ops! Non hai ancora creato la tua squadra!"
      class="md-layout-item md-size-33 md-medium-size-45 md-small-size-50 md-xsmall-size-100"
      v-if="teams == 0" > 
    </md-empty-state>

  <div v-if="teams != 0" class="md-layout md-gutter">
      <div
        class="md-layout-item md-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100"
        v-for="team in teams"
        :key="team.name"
        @click="DigimonInfo(team.name)">

        <md-card md-with-hover>
          <md-card-media>
            <img :src="team.img" />
          </md-card-media>

          <md-card-header>
            <div class="md-title">{{ team.name }}</div>
            <div class="md-subhead">{{ team.level }}</div>
          </md-card-header>

          <md-card-actions>
            <md-button class="md-icon-button" @click="like(team.name)" onclick="event.stopPropagation()">
                <md-icon v-if="likes.includes(team.name)">favorite</md-icon>
                <md-icon v-else>favorite_border</md-icon>
                <md-tooltip md-direction="bottom">Preferiti</md-tooltip>
              </md-button>
            
              <md-button class="md-icon-button" @click="added(team.name)" onclick="event.stopPropagation()">
                <md-icon>playlist_add_check</md-icon>
                <md-tooltip md-direction="bottom">Squadra</md-tooltip>
              </md-button> 
          </md-card-actions>
        </md-card>
      </div> 
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
      teams: [],
      likes: [],
    };
  },
  created: function () {
    this.load();
  },
  methods: {
    load() {
      this.teams = [];
      dataservice.controlteam().then((data) => {
        data.forEach((element) => {
          dataservice.getDigimonInfo(element).then((data) => {
            this.teams.push(data.data[0]);
          });
        });
      });
      this.likes = [];
        dataservice.controllike().then((data) => {
          data.forEach((element) => {
            dataservice.getDigimonInfo(element).then((data) => {
              this.likes.push(data.data[0].name);
          });
        });
      });
    },
    added(name) {
      dataservice.removeteam(name);
      setTimeout(() => {
        this.teams=this.removesquadra(this.teams,name);
      }, 500)
    },
    remove(arr, value) { //questa serve per l'icona like
      var i = 0; 
      while (i < arr.length) {
        if (arr[i] === value) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }
    return arr; 
    },

    removesquadra(arr, value) {   //questa per l'icona squadra
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
    
    like(name){
      if (this.likes.includes(name)) { //se include già il digimon, si toglie il like, altrimenti si aggiunge
        dataservice.removelike(name)
        this.likes = this.remove(this.likes,name)
      }
      else {
        dataservice.like(name)
        this.likes.push(name)
        //prima c'era this.controllike()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .md-card {
  margin: 10px;
  }
</style>