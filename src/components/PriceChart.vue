<template>
  <h1>{{ config.symbol }}</h1>
  <h3>interval: {{ config.interval }}</h3>
  <div>
    <button @click="setSymbol('btcusdt')">btc-usd</button>
    <button @click="setSymbol('ethusdt')">eth-usd</button>
    <button @click="setSymbol('bnbusdt')">bnb-usd</button>
    <button @click="setSymbol('ethbtc')">eth-btc</button>
    <button @click="setInterval('1m')">1m</button>
    <button @click="setInterval('5m')">5m</button>
    <button @click="setInterval('1h')">1h</button>
  </div>

  <div v-if="error">error: {{ error }}</div>
  <div v-else-if="!candleSeries">Loading Chart...</div>

  <div v-show="candleSeries && !error" id="chart"></div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        symbol: "btcusdt", // default (lowercase only!)
        interval: "1m", // default
      },
      chart: null,
      candleSeries: null,
      webSocket: null,
      error: null,
    };
  },
  methods: {
    setSymbol(symbol) {
      this.config.symbol = symbol;
    },
    setInterval(interval) {
      this.config.interval = interval;
    },
    updateCandleSeries(e) {
      let data = JSON.parse(e.data);
      let chartData = data.data;
      let timestamp = toLocalTime(new Date(chartData.k.t).getTime() / 1000);

      const newBar = {
        time: timestamp,
        open: chartData.k.o,
        high: chartData.k.h,
        low: chartData.k.l,
        close: chartData.k.c,
      };
      this.candleSeries.update(newBar);
    },
    fetchChart() {
      // init candleSeries
      fetch(
        "https://fapi.binance.com/fapi/v1/klines?" +
          new URLSearchParams({
            symbol: this.config.symbol,
            interval: this.config.interval,
          }),
        {
          headers: {
            apiKey: BINANCE_API_KEY,
            secretKey: BINANCE_SECRET_KEY,
          },
        }
      )
        .then((res) => {
          if (res.ok) return res.json();

          this.error = "Invalid chart config";
          return res.text().then((text) => {
            throw new Error(text);
          });
        })
        .then((response) => {
          const data = response.map((res) => ({
            time: toLocalTime(Date.parse(new Date(res[0])) / 1000),
            open: Number(res[1]),
            high: Number(res[2]),
            low: Number(res[3]),
            close: Number(res[4]),
          }));
          this.candleSeries.setData(data);
        });

      // keep update candleSeries
      this.webSocket = new WebSocket(
        `wss://fstream.binance.com/stream?streams=${this.config.symbol}@kline_${this.config.interval}`
      );
      this.webSocket.addEventListener("message", this.updateCandleSeries);
    },
  },
  watch: {
    config: {
      handler: function reload() {
        // reset data
        this.webSocket.removeEventListener("message", this.updateCandleSeries);
        this.error = null;
        // load data
        this.fetchChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = LightweightCharts.createChart("chart", chartStyle);
    this.candleSeries = this.chart.addCandlestickSeries(candleSeriesStyle);
    this.fetchChart();
  },
};

// todo: read from .env
const BINANCE_API_KEY =
  "dbefbc809e3e83c283a984c3a1459732ea7db1360ca80c5c2c8867408d28cc83";
const BINANCE_SECRET_KEY =
  "2b5eb11e18796d12d88f13dc27dbbd02c2cc51ff7059765ed9821957d82bb4d9";

function toLocalTime(originalTime) {
  const d = new Date(originalTime * 1000);
  return (
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    ) / 1000
  );
}

const chartStyle = {
  width: 700,
  height: 600,
  layout: {
    backgroundColor: "#253248",
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "#334158",
    },
    horzLines: {
      color: "#334158",
    },
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
  priceScale: {
    borderColor: "#485c7b",
  },
  timeScale: {
    borderColor: "#485c7b",
  },
};

const candleSeriesStyle = {
  color: "#182233",
  // lineWidth: 2,
  // priceFormat: {
  //   type: "volume",
  // },
  // overlay: true,
};
</script>

<style>
</style>