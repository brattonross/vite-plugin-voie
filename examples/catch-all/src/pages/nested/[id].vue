<template>
  <h2>Nested id - {{ id }}</h2>
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
