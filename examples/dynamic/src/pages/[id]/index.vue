<template>
  <div class="container">
    <h1>Dynamic slug - {{ id }}</h1>
    <router-link to="/">Back to home page</router-link>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
};
</script>
