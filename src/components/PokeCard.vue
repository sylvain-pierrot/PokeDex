<template>
  <figure>
    <router-link
      :to="{ name: 'Pokemon', params: { id: pokemon.id } }"
      class="card"
      :style="{ backgroundColor: pokemon.color + 'cc' }"
    >
      <img :src="pokemon.image" :alt="pokemon.name" />
      <div>
        <h2>{{ pokemon.name }}</h2>
        <ul class="types">
          <li v-for="(type, index) in pokemon.types" :key="index">
            {{ type.name }}
          </li>
        </ul>
      </div>
      <h4>#{{ pokemon.id }}</h4>
    </router-link>
  </figure>
</template>

<script setup>
import { toRefs, defineProps } from "vue";

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

const { pokemon } = toRefs(props);
</script>

<style scoped>
.card {
  position: relative;
  text-decoration: none;
  width: 400px;
  height: 300px;
  border-radius: 3em;
  padding: 2em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  background-image: url("../assets/pokeball1.png");
  background-size: 15em;
  background-repeat: no-repeat;
  background-position-x: 11em;
  background-position-y: 5em;
  background-blend-mode: overlay;
}
.card img {
  max-width: 18em;
  height: 12em;
  position: absolute;
  bottom: 1em;
  right: 1em;
  transition: ease 0.1s;
}
.card h2 {
  color: #fff;
  font-weight: 600;
  margin-bottom: 15px;
  margin-top: 20px;
  font-size: 32px;
}
.card h2::first-letter {
  text-transform: uppercase;
}
.card h4 {
  font-size: 20px;
  color: #0000007d;
}
.types {
  list-style: none;
}
.types > li {
  text-align: center;
  background: #ffffff79;
  padding: 5px 20px;
  border-radius: 1em;
  color: #fff;
  margin-bottom: 8px;
  width: fit-content;
}
.types > li::first-letter {
  text-transform: uppercase;
}
</style>
