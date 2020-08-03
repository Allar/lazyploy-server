<template lang="pug">
div
  block content
    h1 Lazyploy

    b-container
      b-row
        b-col
         BuildList
</template>

<script>
import BuildList from './BuildList.vue';

export default {
  name: 'Home',
  components: {
    BuildList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
