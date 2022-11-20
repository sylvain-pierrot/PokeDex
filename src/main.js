import { createApp } from "vue";
import * as VueRouter from "vue-router";
import store from "./store";
import App from "./App.vue";
import PokedexPage from "./views/PokedexPage.vue";
import LegendariesPage from "./views/LegendariesPage.vue";
import PokemonPage from "./views/PokemonPage.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/pokedex",
      name: "Pokedex",
      component: PokedexPage,
    },
    {
      path: "/legendaries",
      name: "Legendaries",
      component: LegendariesPage,
    },
    {
      path: "/pokedex/:id",
      name: "Pokemon",
      props: true,
      component: PokemonPage,
    },
  ],
});

const app = createApp(App);
app.use(router);
app.use(store);
app.mount("#app");
