import { createStore } from "vuex";
import cache from "./cache.json";
const Pokedex = require("pokeapi-js-wrapper");

export default createStore({
  state: {
    language: "fr",
    pokedex: new Pokedex.Pokedex({ cache: true }),
    interval: { limit: 20, offset: 0 },
    pokemons: [],
    pokemons_legendaries: [],
    matchs: [],
    colors: {
      normal: "#A8A77A",
      fire: "#EE8130",
      water: "#6390F0",
      electric: "#F7D02C",
      grass: "#7AC74C",
      ice: "#96D9D6",
      fighting: "#C22E28",
      poison: "#A33EA1",
      ground: "#E2BF65",
      flying: "#A98FF3",
      psychic: "#F95587",
      bug: "#A6B91A",
      rock: "#B6A136",
      ghost: "#735797",
      dragon: "#6F35FC",
      dark: "#705746",
      steel: "#B7B7CE",
      fairy: "#D685AD",
    },
    cache: cache,
  },
  mutations: {
    RESET_POKEDEX(state) {
      state.interval.offset = 0;
      state.interval.limit = 20;
      state.pokemons = [];
    },
    PUSH_POKEMONS(state, pokemons) {
      state.pokemons.push(...pokemons);
      state.interval.offset += 20;
    },
    PUSH_POKEMONS_FILTER(state, pokemons) {
      state.pokemons = pokemons;
      state.matchs = [];
    },
    PUSH_POKEMONS_LEGENDARIES(state, pokemons) {
      state.pokemons_legendaries = pokemons;
    },
    PUSH_MATCHS(state, matchs) {
      state.matchs = matchs;
    },
  },
  actions: {
    findByLang({ state }, list) {
      const found =
        list.find((elem) => {
          return elem.language.name === state.language;
        }) || "???";
      return found.name || found.flavor_text || found;
    },
    async evolution({ dispatch }, chain) {
      let evoList = [];
      let minLevel =
        chain.evolution_details.length > 0
          ? chain.evolution_details[0].min_level
          : false;
      evoList.push({
        poke: await dispatch("createPokemon", {
          name: chain.species.name,
          minimal: true,
        }),
        minLevel: minLevel,
      });
      if (chain.evolves_to.length > 0) {
        let evolves = [];
        for (const evo of chain.evolves_to) {
          evolves.push(await dispatch("evolution", evo));
        }
        evoList.push(evolves);
      }
      return evoList;
    },
    async createPokemon({ state, dispatch }, { name, minimal }) {
      const pokemon = {};
      const poke = await state.pokedex.getPokemonByName(name);
      const pokeSpecies = await state.pokedex.resource(poke.species.url);
      const pokeForm = await state.pokedex.resource(poke.forms[0].url);

      // id
      pokemon.id = poke.id;
      // name
      pokemon.name = poke.is_default
        ? await dispatch("findByLang", pokeSpecies.names)
        : await dispatch("findByLang", pokeForm.form_names);
      // types
      pokemon.types = await Promise.all(
        poke.types.map(async (type) => {
          let t = await state.pokedex.getTypeByName(type.type.name);
          return {
            name: await dispatch("findByLang", t.names),
            color: state.colors[t.name],
          };
        })
      );
      // color
      pokemon.color = state.colors[poke.types[0].type.name];
      // image
      pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;

      if (!minimal) {
        // evolutions
        const chain = await dispatch(
          "evolution",
          (
            await state.pokedex.resource(pokeSpecies.evolution_chain.url)
          ).chain
        );
        pokemon.evolutions = !(pokeSpecies.evolution_chain === null)
          ? chain
          : [];
        // legendary
        pokemon.legendary = pokeSpecies.is_legendary;
        // description
        pokemon.description = await dispatch(
          "findByLang",
          pokeSpecies.flavor_text_entries
        );
        // specifications
        pokemon.specifications = {
          height: poke.height / 10,
          weight: poke.weight / 10,
          category: "pas trouvé",
          attacks: "pas trouvé",
        };
        // varieties
        pokemon.varieties = await Promise.all(
          pokeSpecies.varieties.map(async (poke) => {
            return await dispatch("createPokemon", {
              name: poke.pokemon.name,
              minimal: true,
            });
          })
        );
        // abilities
        pokemon.abilities = await Promise.all(
          poke.abilities
            .filter((ability) => {
              return !ability.is_hidden;
            })
            .map(async (ability) => {
              let a = await state.pokedex.getAbilityByName(
                ability.ability.name
              );
              return await dispatch("findByLang", a.names);
            })
        );
        // habitat
        if (pokeSpecies.habitat != null) {
          const listNamesHabitat = (await state.pokedex.resource(pokeSpecies.habitat.url)).names;
          pokemon.habitat = await dispatch("findByLang", listNamesHabitat);
        } else {
          pokemon.habitat = "???";
        }
        // moves
        // pokemon.moves = (
        //   await Promise.all(
        //     poke.moves.map(async (move) => {
        //       let m = await state.pokedex.resource(move.move.url);
        //       return await dispatch("findByLang", m.names);
        //     })
        //   )
        // ).join(", ");
      }

      return pokemon;
    },
    async generatePokedex({ state, commit, dispatch }, init) {
      if (init) {
        commit("RESET_POKEDEX");
      }
      const pokeList = await state.pokedex.getPokemonsList(state.interval);
      const pokemons = await Promise.all(
        pokeList.results.map(async (pokemon) => {
          return await dispatch("createPokemon", {
            name: pokemon.name,
            minimal: true,
          });
        })
      );
      commit("PUSH_POKEMONS", pokemons);
    },
    async generatePokedexBySearch({ state, commit, dispatch }, search) {
      if (search != "") {
        const pokemons = await Promise.all(
          state.cache
            .filter((poke) => {
              return (
                poke.traduction.toLowerCase().includes(search.toLowerCase()) ||
                parseInt(search) === poke.id
              );
            })
            .map(async (poke) => {
              return await dispatch("createPokemon", {
                name: poke.name,
                minimal: true,
              });
            })
        );

        commit("PUSH_POKEMONS_FILTER", pokemons);
      } else {
        await dispatch("generatePokedex", true);
      }
    },
    async generateLegendaries({ state, commit, dispatch }) {
      const pokemons = await Promise.all(
        state.cache
          .filter((poke) => {
            return poke.legendary;
          })
          .map(async (poke) => {
            return await dispatch("createPokemon", {
              name: poke.name,
              minimal: true,
            });
          })
      );

      commit("PUSH_POKEMONS_LEGENDARIES", pokemons);
    },
    async generateMatchsPokemons({ state, commit }, search) {
      const matchs = [];
      if (search != "") {
        let matched = 0;
        matchs.push(
          ...state.cache.filter((poke) => {
            return (
              poke.traduction.toLowerCase() != search.toLowerCase() &&
              poke.traduction.toLowerCase().includes(search.toLowerCase()) &&
              matched++ < 10
            );
          })
        );
      }
      commit("PUSH_MATCHS", matchs);
    },
  },
});
