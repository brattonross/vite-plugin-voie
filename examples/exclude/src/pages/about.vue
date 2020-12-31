<template>
  <div class="container">
    <h1>About</h1>
    <hello-world />
    <router-link to="/">Back to home page</router-link>
  </div>
</template>

<script>
import HelloWorld from './internal/HelloWorld.vue';

export default {
  components: { HelloWorld }
}
</script>
