<template>
  <div class="content center">
    <h2>Error</h2>
    <h3>{{ err || "something wrong..." }}</h3>
  </div>
</template>

<script>
export default {
  props: ["err"],
};
</script>

<style scoped>
.content {
  padding: 5%;
}
</style>
