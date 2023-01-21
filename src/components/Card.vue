<script>
import axios from "axios";
export default {
  props: ["tradingCurrencies", "symbol"],
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
};
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col-3">
        <img src="@/assets/images/token/bnb-icon.png" alt="" class="token-icon" />
      </div>
      <div class="col-5">
        {{ displayCurrency }}
        {{ value }}
      </div>
      <div class="col-4 center">{{ percentChange }}%</div>
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

  top: 0;
  bottom: 0;
  margin: auto;
}

.row {
  height: 100%;
  text-align: left;
}
</style>
