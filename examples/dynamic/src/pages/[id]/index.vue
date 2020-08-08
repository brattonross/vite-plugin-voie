<template>
  <div class="container">
    <h1>Dynamic slug - {{ id }}</h1>
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