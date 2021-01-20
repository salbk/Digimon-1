import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueRouter from "vue-router";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import login from "./pages/login";
import listaDigimon from "./pages/listaDigimon";
import DigimonInfo from "./pages/DigimonInfo";
import DigimonPreferiti from "./pages/DigimonPreferiti";
import DigimonSquadra from "./pages/DigimonSquadra";
import AboutDigimon from "./pages/AboutDigimon";
import dataservice from "./dataservice";

Vue.use(VueMaterial);
Vue.use(VueRouter);

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      name: "Login",
      path: "/login",
      component: login
    },
    {
      name: "ListaDigimon",
      path: "/",
      component: listaDigimon
    },
    {
      name: "Digimon",
      path: "/info/:name",
      component: DigimonInfo
    },
    {
      name: "DigimonPreferiti",
      path: "/Preferiti",
      component: DigimonPreferiti
    },
    {
      name: "DigimonSquadra",
      path: "/Squadra",
      component: DigimonSquadra
    },
    {
      name: "AboutDigimon",
      path: "/AboutDigimon",
      component: AboutDigimon
    }
  ]
});

router.beforeEach((to,from,next) => {
  if (to.name!=="Login"&& !dataservice.isAuthenticated())
  next({ name:"Login" });
  else {
    next();
  }
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount("#app");