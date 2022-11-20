<template>
  <article class="pokemon">
    <div class="pokemon-header" :style="{ backgroundColor: pokemon.color }">
      <select
        v-model="varieteId"
        v-if="pokemon.varieties.length > 1"
        name="varieties"
        @change="varietieChange"
        :style="{ backgroundColor: pokemon.color }"
      >
        <option value="" disabled selected hidden>{{ pokemon.name }}</option>
        <option
          v-for="varietie in pokemon.varieties"
          :key="varietie.id"
          :value="varietie.id"
        >
          {{ varietie.name }}
        </option>
      </select>
      <h1 v-else>{{ pokemon.name }}</h1>
    </div>
    <ul class="pokemon-types">
      <li v-for="(type, index) in pokemon.types" :key="index">
        <span
          class="type"
          :style="{ backgroundColor: type.color }"
          v-if="type"
        ></span>
        {{ "Type " + type.name }}
      </li>
    </ul>
    <div class="pokemon-image">
      <div class="overlay" :style="{ backgroundColor: pokemon.color }"></div>
      <h2 class="legendary" v-if="pokemon.legendary">LEGENDAIRE</h2>
      <img :src="pokemon.image" :alt="pokemon.name" />
    </div>
    <div class="pokemon-description">
      <div class="specifications">
        <div>
          <p :style="{ backgroundColor: pokemon.color }">
            <span>Id</span>
            <span>#{{ pokemon.id }}</span>
          </p>
          <p :style="{ backgroundColor: pokemon.color }">
            <span>Taille</span>
            <span>{{ pokemon.specifications.height }} m</span>
          </p>
          <p :style="{ backgroundColor: pokemon.color }">
            <span>Poids</span>
            <span>{{ pokemon.specifications.weight }} kg</span>
          </p>
        </div>
        <div>
          <p :style="{ backgroundColor: pokemon.color }">
            <span>Habitat</span>
            <span>{{ pokemon.habitat }}</span>
          </p>
          <p :style="{ backgroundColor: pokemon.color }">
            <span>Talent(s)</span>
            <span>{{ pokemon.abilities.join(", ") }}</span>
          </p>
        </div>
      </div>
      <div class="infos">
        <p>{{ pokemon.description }}</p>
      </div>
    </div>
    <div class="pokemon-evolution" v-if="pokemon.evolutions.length > 0">
      <div v-if="pokemon.evolutions.length > 1">
        <h2>ÉVOLUTION</h2>
        <TreeEvolutions :evolutions="pokemon.evolutions"></TreeEvolutions>
      </div>
      <h2 v-else>CE POKEMON N'ÉVOLUE PAS.</h2>
    </div>
  </article>
</template>

<script setup>
import { ref, defineProps, toRefs } from "vue";
import { useRouter } from "vue-router";
import TreeEvolutions from "./TreeEvolutions.vue";

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const varieteId = ref("");
const { pokemon } = toRefs(props);

// function
function varietieChange() {
  router.push({ name: "Pokemon", params: { id: varieteId.value } });
}
</script>

<style scoped>
.pokemon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 5em;
}
.pokemon > * {
  width: 100%;
}
.pokemon-header {
  padding: 8px 0;
  font-size: 3.5em;
  text-transform: uppercase;
  border-bottom: 6px solid #fff;
  border-top: 6px solid #fff;
  height: auto;
  display: grid;
  justify-content: center;
  align-items: center;
}
.pokemon-header select {
  font-size: 1em;
  border: solid 1px #000;
  text-transform: uppercase;
  font-weight: 600;
}
.pokemon-types {
  list-style: none;
  margin-top: 4em;
  margin-bottom: 2em;
  display: flex;
  justify-content: space-evenly;
}
.pokemon-types li {
  position: relative;
  padding: 3px 3em;
  border-bottom: 3px solid #000;
  font-weight: 600;
}
.pokemon-types li::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  left: 0;
  bottom: 0;
  background-color: #000;
  transform: translate(-50%, 55%);
}
.pokemon-types li .type {
  content: "";
  position: absolute;
  width: 4em;
  height: 4em;
  border-radius: 50%;
  border: 3px solid #000;
  right: 0;
  bottom: 0;
  transform: translate(50%, 15%);
}
.pokemon-image {
  background-color: #fff;
  position: relative;
  height: 25em;
  width: 25em;
  padding: 4em;
  mask: url("../assets/heptagone.png");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: bottom;
}
.pokemon-image img {
  z-index: 1;
  position: sticky;
  width: 100%;
  height: 100%;
}
.pokemon-image .overlay {
  content: "";
  position: absolute;
  top: 5px;
  bottom: 5px;
  right: 5px;
  left: 5px;
  mask: url("../assets/heptagone.png");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: bottom;
  z-index: -1;
}
.pokemon-description {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pokemon-description .specifications {
  display: flex;
}
.pokemon-description .specifications div:nth-child(1) {
  border-right: solid 2px #fff;
  width: 50%;
  padding-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.pokemon-description .specifications div:nth-child(2) {
  border-left: solid 2px #fff;
  width: 50%;
  padding-top: 2em;
}
.pokemon-description .specifications div p {
  display: flex;
  flex-direction: column;
  border: solid 1px #fff;
  margin-bottom: 4em;
  padding: 10px;
  width: max-content;
}
.pokemon-description .specifications div:nth-child(2) p {
  margin-top: 4em;
}
.pokemon-description .specifications div p span:first-child {
  font-weight: 600;
}
.pokemon-description .infos {
  position: relative;
  width: fit-content;
  margin-bottom: 5em;
}
.pokemon-description .infos p {
  font-size: 0.8em;
  line-height: 2em;
  padding: 3em 5em;
  width: 30em;
  text-transform: uppercase;
  background-color: #000;
  color: #fff;
  font-weight: 600;
  border-radius: 0 4em 0 4em;
  border: solid 4px #fff;
}
.legendary {
  position: absolute;
  top: 30px;
  right: 0;
  left: 0;
  padding: 10px;
  font-size: 2em;
  text-transform: uppercase;
  background-color: rgb(143, 25, 25);
  color: #fff;
}
.pokemon-evolution h2 {
  padding: 10px 0;
  font-size: 2em;
  text-transform: uppercase;
  background-color: #fff;
  color: #000;
  width: 100%;
  margin-bottom: 2em;
}
</style>
