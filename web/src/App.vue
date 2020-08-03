<template>
  <div id="app">
  <!--
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  -->
    <Home/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from './components/Home.vue';

@Component({
  components: {
    Home,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  
}
</style>
