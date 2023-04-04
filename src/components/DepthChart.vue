<template>
  <div class="chart" id="depthchart">This is Depth Chart for {{ symbol }}</div>
</template>

<script>
function loadChart(symbol) {
  // do something
}

export default {
  props: ["symbol"],
  mounted() {
    loadChart(this.symbol);
  },
  watch: {
    symbol() {
      loadChart(this.symbol);
    },
  },
};
</script>

<style scoped>
.chart {
  height: 80%;
  min-height: 75vh;
}
</style>
