<template>
  <div class="chart" id="depthchart">
    This is Depth Chart for {{ symbol }}:
    {{ d }}
  </div>
</template>

<script>
export default {
  props: ["symbol"],
  data() {
    return {
      ws: null,
      d: null,
    };
  },
  mounted() {
    this.loadChart(this.symbol);
  },
  watch: {
    symbol() {
      this.loadChart(this.symbol);
    },
  },
  methods: {
    updateData(e) {
      let data = JSON.parse(e.data) || {};
      // console.log(data);
      this.d = data;
    },
    async loadChart(symbol) {
      if (this.ws != null) {
        this.ws.removeEventListener("message", this.updateData);
      }
      this.ws = new WebSocket(
        "wss://stream.binance.com:9443/ws/" + symbol.toLowerCase() + "@depth20"
      );
      this.ws.addEventListener("message", this.updateData);
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
