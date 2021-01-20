<template>
  <div class="md-layout md-alignment-center-center">
    
    <md-card class="md-layout-item md-size-30 md-xsmall-size-100 md-medium-size-50">

      <md-card-header>
        <span class="md-title"> Login </span>
      </md-card-header>

      <md-card-content>
        <md-field>
          <label> Username </label>
          <md-input v-model="username"></md-input><!-- si collega alla variabile username -->
        </md-field>
      </md-card-content>

      <md-card-action>
        <md-button class="md-primary md-raised" :disabled="!username" @click="signIn()"> Sign in </md-button>
      </md-card-action> <!-- disabled se non c'è alcuna lettera scritta -->

    </md-card>
    
  </div>
</template>

<script>
import dataservice from "../dataservice";
export default {
  data: function() {
    return {
      username: ""
    };
  },
  methods: {
    signIn: function() {
      dataservice.login(this.username);
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style>
</style>











