<template>
  <div class="container">
    <h1>Home page</h1>
    <hello-world />
    <router-link to="/about">To About page</router-link>
  </div>
</template>

<script>
import HelloWorld from './internal/HelloWorld.vue';

export default {
  components: { HelloWorld }
}
</script>
