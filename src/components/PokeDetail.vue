<template>
    <article class="pokemon">
        <div class="pokemon-header" :style="{ backgroundColor: color }">
            <select v-if="pokeVarieties.length > 1" name="varieties" onchange="document.location.href = '/pokedex/' + this.value" :style="{ backgroundColor: color }">
                <option v-for="varietie in pokeVarieties" :key="varietie.id"  :value="varietie.id" :selected="varietie.name === name" >{{ varietie.name }}</option>
            </select>
            <h1 v-else>{{ name }}</h1>
        </div>
        <ul class="pokemon-types">
            <li v-for="(type, index) in types" :key="index">
                <span class="type" :style="{ backgroundColor: type.color }" v-if="type"></span>
                {{ 'Type ' + type.name }}
            </li>
        </ul>
        <div class="pokemon-image">
            <div>
                <img :src="image" :alt="name" :style="{ backgroundColor: color }">
            </div>
        </div>
        <div class="pokemon-description">
            <div class="specifications">
                <div>
                    <h3 :style="{ backgroundColor: color }">Région(s):</h3>
                    <p></p>
                    <h3 :style="{ backgroundColor: color }">Taille:</h3>
                    <p>{{ specifications.height }} m</p>
                    <h3 :style="{ backgroundColor: color }">Poids:</h3>
                    <p>{{ specifications.weight }} kg</p>
                    <h3 :style="{ backgroundColor: color }">Catégorie:</h3>
                    <p></p>
                    <h3 :style="{ backgroundColor: color }">Talent(s):</h3>
                    <p v-for="(ability, index) in abilities" :key="index">{{ ability }}</p>
                </div>
                <div>
                    <h3 :style="{ backgroundColor: color }">Attaque(s):</h3>
                    <p class="attacks">{{ moves }}</p>
                </div>
            </div>
            <div class="infos">
                <p>{{ description }}</p>
            </div>
            <div class="legendary" v-if="legendary">
                <h2>POKEMON LEGENDAIRE</h2>
            </div>
        </div>
        <div class="pokemon-evolution">
            <h2 v-if="pokeEvolves.length > 1">EVOLUTION</h2>
            <ul class="evolutions" v-if="pokeEvolves.length > 1">
                <li v-for="evo in pokeEvolves" :key="evo.poke.id">
                    <router-link class="transparent" :to="{ name: 'Pokemon', params: { id: evo.poke.id }}">
                        <img :src="evo.poke.image" :alt="evo.poke.name" :style="{ backgroundColor: evo.poke.color }">
                        <p>{{ evo.poke.name + ' #' + evo.poke.id }}</p>
                    </router-link>
                    <span class="min-lvl" v-if="evo.minLevel">{{ 'lvl' + evo.minLevel }}</span>
                    <span class="min-lvl" v-if="evo.minLevel === null">{{ '???' }}</span>

                </li>
            </ul>
            <h2 v-else>CE POKEMON N'EVOLUE PAS.</h2>
        </div>
    </article>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
    pokemon: {
        type: Object,
        required: true
    } 
})

const store = useStore()
const pokeEvolves = ref([])
const pokeVarieties = ref([])

// const id = computed (() => {  return props.pokemon.id})
const name = computed(() => {  return props.pokemon.name})
const types = computed(() => {  return props.pokemon.types})
const color = computed(() => {  return props.pokemon.color})
const image = computed (() => {  return props.pokemon.image})
const legendary = computed (() => {  return props.pokemon.legendary})
const description = computed (() => {  return props.pokemon.description})
const specifications = computed (() => {  return props.pokemon.specifications})
const abilities = computed (() => {  return props.pokemon.abilities})
const moves = computed (() => {  return props.pokemon.moves})

onMounted(async () => {  
    pokeEvolves.value = await Promise.all(
        props.pokemon.evolutions.map(async (poke) => {  return { poke: await store.dispatch('createPokemon', { name: poke.name, minimal: true }), minLevel: poke.minLevel }})
    )
    pokeVarieties.value = await Promise.all(
        props.pokemon.varieties.map(async (varietie) => {  return await store.dispatch('createPokemon', { name: varietie, minimal: true })})
    )
})
</script>

<style scoped>
.pokemon {
    display: grid;
    text-align: center;
    margin-bottom: 5em;
}
.pokemon-header {
    padding: 8px 0;
    font-size: 3.5em;
    text-transform: uppercase;
    border-bottom: 6px solid #FFF;
    border-top: 6px solid #FFF;
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
    display: flex;
    justify-content: center;
}
.pokemon-image div {
    position: relative;
    height: 25em;
    width: 25em;
}
.pokemon-image div::before {
    content: "";
    position: absolute;
    top: -8px;
    bottom: -8px;
    right: -8px;
    left: -8px;
    background-color: #FFF;
    mask: url("../assets/heptagone.png");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
}
.pokemon-image div img {
    mask: url("../assets/heptagone.png");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    width: 25em;
    height: 25em;
    padding: 4em;
}
.pokemon-description {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pokemon-description .specifications {
    display: flex;
}
.pokemon-description .specifications div p {
    font-weight: 600;
}
.pokemon-description .specifications div:nth-child(1) {
    border-right: solid 2px #FFF;
    width: 50%;
    padding-top: 2em;
    padding-bottom: 4em;
}
.pokemon-description .specifications div:nth-child(2) {
    border-left: solid 2px #FFF;
    width: 50%;
    padding-top: 2em;
    padding-bottom: 5em;
}
.attacks {
    width: 30em;
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
    color: #FFF;
    font-weight: 600;
    border-radius: 0 4em 0 4em;
    border: solid 4px #FFF;
}
.pokemon-description .legendary {
    margin-bottom: 3em;
}
.pokemon-description .legendary h2 {
    padding: 10px 20px;
    font-size: 2em;
    text-transform: uppercase;
    background-color: rgb(143, 25, 25);
    color: #FFF;
}
.pokemon-evolution h2 {
    padding: 10px 0;
    font-size: 2em;
    text-transform: uppercase;
    background-color: #FFF;
    color: #000;
    width: 100%;
}
.evolutions {
    position: relative;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 2em 0;
}
.evolutions::after {
    content: "";
    height: 10px;
    position: absolute;
    left: 0;
    right: 0;
    background-color: #FFF;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
}
.evolutions li {
    position: relative;
    margin: 2em 5em;
    white-space: nowrap;
}
.evolutions .min-lvl {
    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    padding: 5px;
    color: #ff1a1a;
    background-color: #000;
    border: solid 2px #FFF;
    font-weight: 600;
    font-size: 24px;
    white-space: nowrap;
}
.evolutions li p {
    position: absolute;
    top: calc(102%);
    left: 50%;
    transform: translateX(-50%);
    color: #FFF;
}
.evolutions li img {
    position: relative;
    mask: url("../assets/octogone.png");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    width: 12em;
    height: 12em;
    padding: 1.5em;
}
.evolutions li::before {
    content: "";
    position: absolute;
    top: -5px;
    bottom: -5px;
    right: -5px;
    left: -5px;
    background-color: #FFF;
    mask: url("../assets/octogone.png");
    mask-size: contain;
    mask-repeat: no-repeat;
}
</style>