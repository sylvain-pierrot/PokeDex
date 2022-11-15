<template>
  <nav class="main">
    <ul>
      <li class="pokedex"><router-link :to="{ name: 'Pokedex'}" class="router-link"></router-link></li>
      <li class="pokedex2"><router-link :to="{ name: 'Second'}" class="router-link"></router-link></li>
    </ul>
  </nav>

  <router-view></router-view>

  <a href="#app" class="arrow-go-back-up"><img src="./assets/arrow.png" alt="arrow-go-back-up"></a>
</template>

<script setup>
</script>

<style>
*, ::before, ::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Flexo-Demi",arial,sans-serif;
}
html {
  scroll-behavior:smooth
}
body {
  background-image: url("./assets/pokeball2.png");
  background-position: 100% 0%;
  background-size: 50em;
  background-repeat: repeat-y;
  background-color: #4b4b4b;
}
/* #app */
.main ul {
  padding: 3em 0;
  display: flex;
  justify-content: center;
}
.main ul li {
  list-style: none;
  display: flex;
  margin: 0 3em;
}
.pokedex .router-link,
.pokedex2 .router-link {
  background-repeat: no-repeat;
  background-position: center;
}
.pokedex .router-link {
  background-image: url("./assets/home.png");
  background-size: contain;
}
.pokedex2 .router-link {
  background-image: url("./assets/pokedex.png");
  background-size: 5em;
}
.router-link {
  position: relative;
  text-decoration: none;
  padding: 4em;
  border-radius: 50%;
}
.router-link-active,
.router-link-exact-active {
  background-color: #FFF;
}
.transparent {
  background-color: transparent;
}
.router-link-active::after,
.router-link-exact-active::after{
  content: "";
  position: absolute;
  left: 50%;
  top: 0;
  width: 3em;
  height: 3em;
  transform: translate(-50%, -50%) rotateZ(180deg);
  background-image: url("./assets/triangle.png");
  background-size: contain;
}

.arrow-go-back-up {
  position: fixed;
  left: 2em;
  bottom: 2em;
}
.arrow-go-back-up img {
  width: 5em;
}
</style>
