<template>
  <div class="container">
    <h1>Catch All Route</h1>
    <pre>Params - {{ all }}</pre>
    <router-link to="/">Back to home page</router-link>
  </div>
</template>

<script>
export default {
  props: {
    all: {
      type: String,
      required: true,
    },
  },
};
</script>
