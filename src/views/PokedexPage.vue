<template>
    <div class="pokedex">
        <section class="section pokedex-header">
            <h1>POKEDEX</h1>
        </section>
        <section class="section pokedex-filter">
            <form id="form" v-on:submit.prevent="onSubmit">
                <div>
                    <label for="search">Quel Pokemon cherchez-vous ?</label>
                    <input v-model="searchTerm" type="text" id="search" name="search" placeholder="Nom ou numéro" autocomplete="off">
                    <div class="matchs">
                        <div v-for="(match, index) in matchs" :key="index" @click="generatePokedexBySearch(match.traduction.toLowerCase())">{{ match.traduction.toLowerCase() }}</div>
                    </div>
                </div>
                <button type="submit" class="button"><img src="../assets/search.png" alt="search-icon"></button>
            </form>
            <button class="button legendary-btn" @click="generateLegendary">LEGENDARY</button>
        </section>
        <section class="section pokedex-results">
            <ul class="results">
                <li v-for="(pokemon, index) in pokemons" :key="index">
                    <PokeCard :pokemon="pokemon"></PokeCard>
                </li>
            </ul>
        </section>    
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { useStore } from 'vuex'
import PokeCard from '../components/PokeCard.vue'
import { watch } from 'vue'

const searchTerm = ref('')
const store = useStore()
const pokemons = computed(() => {  return store.state.pokemons})
const matchs = computed(() => {  return store.state.matchs})

window.addEventListener('scroll', generateMorePokemons)

async function generateMorePokemons() {
    if (window.scrollY >= window.scrollMaxY) { 
        await store.dispatch('generatePokedex')
    }
}
function generatePokedexBySearch(name) {
    searchTerm.value = name
    const evt = new CustomEvent("submit", {"bubbles": true, "cancelable": true})
    document.getElementById('form').dispatchEvent(evt)
}
async function onSubmit(event) {
    event.preventDefault()
    if (searchTerm.value === '') {
        window.addEventListener('scroll', generateMorePokemons)
    } else {
        window.removeEventListener('scroll', generateMorePokemons)
    }
    await store.dispatch('generatePokedexBySearch', searchTerm.value)
}
async function generateLegendary() {
    await store.dispatch('generateAllLegendary')
    window.removeEventListener('scroll', generateMorePokemons)
}

let timer = null
watch(searchTerm, (name) => {
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    timer = setTimeout(async () => {
        await store.dispatch('generateMatchsPokemons', name)
    }, 255)
})

onMounted(async () => {  
    await store.dispatch('generatePokedex')
    // await store.dispatch('initCacheNames')
    // for (const key in store.state.pokemons) {
    //     saveStorage(key, store.state.pokemons[key])
    // }
})
onUnmounted(() => {  window.removeEventListener('scroll', generateMorePokemons)})

// const saveStorage = function(key, data) {
//     localStorage.setItem(key, JSON.stringify(data))
// }
// const getStorage = function(key, item) {
//     if( localStorage.getItem(key) && item) {
//         const data = JSON.parse(localStorage.getItem(key))
//         return data[item]
//     }
//     else if(localStorage.getItem(key)) {
//        return localStorage.getItem(key)
//     }
// }
// const clearStorage = function(key='false') {
//     if(key) {
//         localStorage.removeItem(key)
//     } else {
//         localStorage.clear()
//     }
// }
</script>

<style scoped>
.legendary-btn {
    height: 50px;
    font-size: 16px;
    padding: 1em;
    color: #FFF;
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
.pokedex {
    max-width: 1280px;
    margin: 0 auto;
}
.section {
    padding-top: 2em;
    padding-bottom: 2em;
    color: #FFF;
}
.pokedex-header,
.pokedex-filter {
   padding-right: 3em;
   padding-left: 3em;
   display: flex;
   justify-content: flex-start;
   align-items: flex-end;
}
.pokedex-header h1 {
    font-size: 3em;
    font-weight: 600;
}
.pokedex-filter form {
    position: relative;
    display: flex;
    align-items: flex-end;
}
.pokedex-filter form div {
    display: flex;
    flex-direction: column;
    position: relative;
}
.pokedex-filter form div label {
    margin-bottom: 0.8em;
    font-size: 24px;
}
input[type=text] {
    height: 50px;
    width: 100%;
    min-width: 300px;
    background-color: #ebebeb;
    border: none;
    border-radius: 5px;
    padding: 1em;
    line-height: 1.5;
}
input[type=text]::placeholder {
    color: #6d6d6d;
    font-size: 16px;
}
input[type=text]:focus-visible {
    outline: auto;
}
button[type=submit] {
    width: 50px;
    height: 50px;
}
button[type=submit] img {
    width: 24px;
    transform: translateY(2px);
}
.matchs {
    position: absolute !important;
    background-color: #ebebeb;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 1;
}
.matchs div {
    box-sizing: content-box;
    height: 100%;
    color: #000;
    padding: 1em;
    cursor: pointer;
}
.matchs div:hover {
    background-color: #ff1a1a;
}
.pokedex-results .results {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.pokedex-results .results li {
    margin: 0.8em;
}
</style>