<template>
  <div class="legendaries">
    <section class="section legendaries-header">
      <h1>POKÉMONS LEGÉNDAIRES</h1>
    </section>
    <section class="section legendaries-results">
      <ul class="results">
        <li v-for="(pokemon, index) in pokemons" :key="index">
          <PokeCard :pokemon="pokemon"></PokeCard>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import PokeCard from "../components/PokeCard.vue";

const store = useStore();
const pokemons = ref([]);

// lifeCycle
onMounted(async () => {
  await store.dispatch("generateLegendaries");
  pokemons.value = store.state.pokemons_legendaries;
});
</script>

<style scoped>
.legendary-btn {
  height: 50px;
  font-size: 16px;
  padding: 1em;
  color: #fff;
  font-weight: 600;
  margin-left: 6em !important;
}
.button {
  margin-left: 0.5em;
  border-radius: 5px;
  border: none;
  background-color: #ff1a1a;
  cursor: pointer;
}
.legendaries {
  max-width: 1280px;
  margin: 0 auto;
}
.section {
  padding-top: 2em;
  padding-bottom: 2em;
  color: #fff;
}
.legendaries-header,
.legendaries-filter {
  padding-right: 3em;
  padding-left: 3em;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
.legendaries-header h1 {
  font-size: 3em;
  font-weight: 600;
}
.legendaries-results .results {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.legendaries-results .results li {
  margin: 0.8em;
}
</style>
