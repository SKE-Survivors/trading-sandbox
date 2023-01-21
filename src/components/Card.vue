<script>
import axios from "axios";

export default {
  props: ["tradingCurrencies"],
  data() {
    return {
      displayCurrency: this.tradingCurrencies.replace("-", "/").toUpperCase(),
      value: 0,
      percentChange: 0,
      midPrice: 0,
    };
  },
  async created() {
    const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
    const res = await axios.get(
      url + this.tradingCurrencies.replace("-", "").toUpperCase()
    );
    this.value = Number(res["data"]["lastPrice"]).toFixed(2);
    this.percentChange = Number(res["data"]["priceChangePercent"]).toFixed(2);
    this.midPrice = Number(res["data"]["weightedAvgPrice"]).toFixed(2);

    new WebSocket(
      "wss://stream.binance.com:9443/ws/" +
        this.tradingCurrencies.replace("-", "") +
        "@ticker"
    ).addEventListener("message", (e) => {
      let data = JSON.parse(e.data) || {};
      let { c, P, w } = data;

      this.value = Number(c).toFixed(2);
      this.percentChange = Number(P).toFixed(2);
      this.midPrice = Number(w).toFixed(2);
    });
  },
  methods: {
    getTokenUrl(n) {
      let currencies = this.tradingCurrencies.split("-");
      return new URL(`../assets/images/token/${currencies[n]}.png`, import.meta.url).href;
    },
  },
};
</script>

<template>
  <div class="card v-center">
    <div class="row">
      <div class="col-5 v-center">
        <img :src="getTokenUrl(0)" alt="" class="token-icon v-center" />
        <img :src="getTokenUrl(1)" alt="" class="token-icon v-center" />
      </div>
      <div class="col-4 v-center">
        {{ displayCurrency }}
        {{ value }}
      </div>
      <div class="col-3 center v-center">{{ percentChange }}%</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  height: 80px;
  width: 240px;

  overflow: hidden;
  cursor: pointer;

  font-size: calc(var(--font-size) - 3px);
}

.row {
  height: 100%;
  text-align: left;
}

.col-3, .col-4, .col-5 {
  padding: 0;
}

.token-icon {
  position: absolute;
  margin-left: 6px;
}

img:nth-child(2) {
  left: 36px;
  z-index: -1;
}
</style>
