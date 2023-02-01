<template>
  <div class="content center">
    <h2>Error</h2>
    <h3>{{ err || "something is wrong..." }}</h3>
  </div>
</template>

<script>
export default {
  props: ["err"],
  mounted() {
    if (!this.err) {
      this.$router.push({ name: "trading" });
    }
  },
};
</script>

<style scoped>
.content {
  padding: 5%;
}
</style>
