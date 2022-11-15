<template>
    <PokeDetail :pokemon="pokemon" v-if="pokemon"></PokeDetail> 
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import PokeDetail from '../components/PokeDetail.vue'

const route = useRoute()
const store = useStore()
const pokemon = ref(null)

onMounted(async () => { 
    // pokemon.value = store.state.pokemons.find((poke) => {  return poke.id === route.params.id}) || await store.dispatch('createPokemon', route.params.id, false)
    pokemon.value = await store.dispatch('createPokemon', { name: route.params.id, minimal: false })
})

watch(route , () => {
    location.reload()
})
</script>

<style scoped>
</style>