<template>
  <div class="tree">
    <figure class="evolution">
      <router-link
        class="transparent"
        :to="{ name: 'Pokemon', params: { id: poke.id } }"
      >
        <img
          :src="poke.image"
          :alt="poke.name"
          :style="{ backgroundColor: poke.color }"
        />
        <p>{{ poke.name + " #" + poke.id }}</p>
      </router-link>
      <span class="min-lvl" v-if="minLevel">{{ "lvl" + minLevel }}</span>
      <span class="min-lvl" v-if="minLevel === null">{{ "???" }}</span>
    </figure>

    <div v-if="hasChildren" class="arrow">
      <img src="../assets/right-arrow.png" alt="down-arrow" />
    </div>

    <div class="children" v-if="hasChildren">
      <TreeEvolutions
        v-for="(evo, index) in evolves_to"
        :key="index"
        :evolutions="evo"
      ></TreeEvolutions>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  evolutions: {
    type: Array,
  },
});

const hasChildren = computed(() => props.evolutions.length > 1);

const poke = ref(props.evolutions[0].poke);
const minLevel = ref(props.evolutions[0].minLevel);
const evolves_to = ref(props.evolutions[1]);
</script>

<style scoped>
.tree {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.children {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.arrow img {
  width: 5em;
  margin: 1em;
}
.evolution {
  position: relative;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2em;
}

.evolution a {
  position: relative;
  white-space: nowrap;
}
.evolution .min-lvl {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  color: #fff;
  background-color: #000;
  border: solid 2px #fff;
  font-weight: 600;
  font-size: 24px;
  white-space: nowrap;
  border-radius: 10px;
}
.evolution a p {
  position: absolute;
  top: calc(102%);
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
}
.evolution a img {
  position: relative;
  mask: url("../assets/octogone.png");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  width: 12em;
  height: 12em;
  padding: 1.5em;
}
.evolution a::before {
  content: "";
  position: absolute;
  top: -5px;
  bottom: -5px;
  right: -5px;
  left: -5px;
  background-color: #fff;
  mask: url("../assets/octogone.png");
  mask-size: contain;
  mask-repeat: no-repeat;
}
</style>
