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
  computed: {
    isNegative() {
      return this.percentChange < 0;
    },
  },
  async created() {
    const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
    const res = await axios.get(
      url + this.tradingCurrencies.replace("-", "").toUpperCase()
    );
    this.setValue(Number(res["data"]["lastPrice"]));
    this.percentChange = Number(res["data"]["priceChangePercent"]).toFixed(2);
    this.midPrice = Number(res["data"]["weightedAvgPrice"]).toFixed(2);

    new WebSocket(
      "wss://stream.binance.com:9443/ws/" +
        this.tradingCurrencies.replace("-", "") +
        "@ticker"
    ).addEventListener("message", (e) => {
      let data = JSON.parse(e.data) || {};
      let { c, P, w } = data;

      this.setValue(Number(c));
      this.percentChange = Number(P).toFixed(2);
      this.midPrice = Number(w).toFixed(2);
    });
  },
  methods: {
    getTokenUrl(n) {
      let currencies = this.tradingCurrencies.split("-");
      return new URL(`../assets/images/token/${currencies[n]}.png`, import.meta.url).href;
    },
    setValue(v) {
      if (v > 1000) {
        this.value = v.toFixed(2);
      } else if (v > 1) {
        this.value = v.toFixed(3);
      } else {
        this.value = v.toFixed(5);
      }
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
      <div class="col-3 center v-center text-green" :class="{ 'text-red': isNegative }">
        {{ percentChange }}%
      </div>
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

.col-3,
.col-4,
.col-5 {
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

.text-green {
  color: #269981;
}

.text-red {
  color: #ed303e;
}
</style>
