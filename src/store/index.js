import { createStore } from 'vuex'
import data from './cache.json'

export default createStore({
  state: {
    language: "fr",
    pokedex: new (require("pokeapi-js-wrapper")).Pokedex({ cache: true }),
    interval: { limit: 20, offset: 0 },
    pokemons: [],
    matchs: [],
    colors: {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
    },
    cacheList: data
    // currentPokemon: []  
  },
  getters: {
  },
  mutations: {
    RESET_INTERVALE(state) {
      state.interval.offset = 0
      state.interval.limit = 20
    },
    UPDATE_INTERVALE(state) {
      state.interval.offset += 20
    },
    EMPTY_POKEMONS(state) {
      state.pokemons = []
    },
    PUSH_POKEMONS(state, pokemons) {
      state.pokemons.push(...pokemons) 
    },
    PUSH_CURRENT_POKEMON(state, pokemon) {
      state.currentPokemon = [pokemon]
    },
    PUSH_MATCHS(state, matchs) {
      state.matchs = matchs
    },
    SETUP_CACHE_NAMES(state, pokeCacheList) {
      state.cacheList = pokeCacheList
    },
  },
  actions: {
    findByLang({ state }, list) {
      const found = list.find((elem) => {
        return elem.language.name === state.language
      }) || '???'
      return found.name || found.flavor_text || found
    },
    // async initCacheNames({ state, commit, dispatch }) {
    //   const pokeList = await state.pokedex.getPokemonsList()
    //   const pokeCacheList = await Promise.all(
    //     pokeList.results.map(async (p) => {
    //       const poke = await state.pokedex.resource(p.url)
    //       const pokeSpecies =  await state.pokedex.resource(poke.species.url)
    //       const tradName = await dispatch('findByLang', pokeSpecies.names)
    //       return { id: poke.id, name: poke.name, traduction: tradName, legendary: pokeSpecies.is_legendary }
    //     })
    //   )

    //   commit('SETUP_CACHE_NAMES', pokeCacheList)
    // },
    async createPokemon({ state, dispatch }, { name, minimal }) {
      const pokemon = {}
      const poke = await state.pokedex.getPokemonByName(name)
      const pokeSpecies = await state.pokedex.resource(poke.species.url)
      const pokeForm = await state.pokedex.resource(poke.forms[0].url)

      // id
      pokemon.id = poke.id
      // name
      pokemon.name = (poke.is_default) ? await dispatch('findByLang', pokeSpecies.names) : await dispatch('findByLang', pokeForm.form_names) 
      // types
      pokemon.types = await Promise.all(
        poke.types.map(async (type) => {  
          let t = await state.pokedex.getTypeByName(type.type.name)
          return { name: await dispatch('findByLang', t.names), color: state.colors[t.name]}
        })
      )
      // color
      pokemon.color = state.colors[poke.types[0].type.name]
      // image
      // `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${poke.id}.svg`
      pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png` 

      if (!minimal) {
        // evolution chain
        const evolution = (chain) => {
          let evoList = []
          let minLevel = (chain.evolution_details.length > 0) ? chain.evolution_details[0].min_level : false
          evoList.push({ name: chain.species.name, minLevel: minLevel })
          if (chain.evolves_to.length > 0) {
            for (const evo of chain.evolves_to) {
              evoList.push(...evolution(evo))
            }
          }
          return evoList
        }
        pokemon.evolutions = (!(pokeSpecies.evolution_chain === null)) ? evolution((await state.pokedex.resource(pokeSpecies.evolution_chain.url)).chain) : []
        // legendary
        pokemon.legendary = pokeSpecies.is_legendary
        // description
        pokemon.description = await dispatch('findByLang', pokeSpecies.flavor_text_entries)
        // specifications
        pokemon.specifications = { height: poke.height/10, weight: poke.weight/10, category: "pas trouvé", attacks: "pas trouvé"}
        // varieties
        pokemon.varieties = pokeSpecies.varieties.map((poke) => {  return poke.pokemon.name})
        // abilities
        pokemon.abilities = await Promise.all(
          poke.abilities.filter((ability) => {
            return !ability.is_hidden
          }).map(async (ability) => {  
              let a = await state.pokedex.getAbilityByName(ability.ability.name)
              return await dispatch('findByLang', a.names)
          })
        )
        // moves
        pokemon.moves = (await Promise.all(
          poke.moves.map(async (move) => { 
              let m = await state.pokedex.resource(move.move.url)
              return await dispatch('findByLang', m.names)
          })
        )).join(', ')
      }

      return pokemon
    },
    async generatePokedex({ state, commit, dispatch }) {
      const pokeList = await state.pokedex.getPokemonsList(state.interval)
      const pokemons = await Promise.all(
        pokeList.results.map(async (pokemon) => {  return await dispatch('createPokemon', { name: pokemon.name, minimal: true })})
      )

      commit('PUSH_POKEMONS', pokemons)
      commit('UPDATE_INTERVALE')
    },
    async generatePokedexBySearch({ state, commit, dispatch }, search) {
      commit('RESET_INTERVALE')
      commit('EMPTY_POKEMONS')
      commit('PUSH_MATCHS', [])

      if (search != '') {
        const pokemons = await Promise.all(
          state.cacheList.filter((poke) => {
            return poke.traduction.toLowerCase().includes(search.toLowerCase()) || parseInt(search) === poke.id
          }).map(async (poke) => {  
            return await dispatch('createPokemon', { name: poke.name, minimal: true })
          })
        )

        commit('PUSH_POKEMONS', pokemons)
      } else {
        await dispatch('generatePokedex')
      }
    },
    async generateMatchsPokemons({ state, commit }, search) {
      let matchs = []
      if (search != '') {
        let matched = 0
        matchs = state.cacheList.filter((name) => {
          return name.traduction.toLowerCase().includes(search.toLowerCase()) && matched++ < 10
        })
      }
      commit('PUSH_MATCHS', matchs)
    },
    async generateAllLegendary({ state, commit, dispatch }) {
      const pokemons = await Promise.all(
        state.cacheList.filter((poke) => {
          return poke.legendary
        }).map(async (poke) => {  
          return await dispatch('createPokemon', { name: poke.name, minimal: true })
        })
      )

      commit('EMPTY_POKEMONS')
      commit('PUSH_POKEMONS', pokemons)
    }
  },
  modules: {
  }
})
