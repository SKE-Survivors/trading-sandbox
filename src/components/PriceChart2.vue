<template>
  <div class="chart" id="tradingview"></div>
</template>

<script>
function loadChart(symbol) {
  let chart = new TradingView.widget({
    autosize: true,
    symbol: "BINANCE:" + symbol,
    interval: "1",
    timezone: "Asia/Bangkok",
    theme: "dark",
    enable_publishing: false,
    container_id: "tradingview",
  });
  return chart;
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
  height: 100%;
  min-height: 75vh;
}
</style>
