<script>
import axios from "axios";
export default {
  props: [
    'tradingCurrencies',
    'symbol',
  ],
  data() {
    return {
      displayCurrency: this.tradingCurrencies.replace("-", "/").toUpperCase(),
      value: 0,
      percentChange: 0,
      midPrice: 0
    }
  },
  async created() {
    const url = "https://api.binance.com/api/v3/ticker/24hr?symbol=";
    const res = await axios.get(
      url + this.tradingCurrencies.replace("-", "").toUpperCase()
      );
      this.value = Number(res["data"]["lastPrice"]).toFixed(2);
      this.percentChange = Number(res["data"]["priceChangePercent"]).toFixed(2)
      this.midPrice = Number(res["data"]["weightedAvgPrice"]).toFixed(2)
      
      new WebSocket('wss://stream.binance.com:9443/ws/' + this.tradingCurrencies.replace("-", "") + '@ticker')
        .addEventListener('message', e => {
          let data = JSON.parse(e.data) || {};
          let { c, P, w } = data;
  
          this.value = Number(c).toFixed(2);
          this.percentChange = Number(P).toFixed(2);
          this.midPrice = Number(w).toFixed(2);
        });
  }
}
</script>

<template>
  <div id="card">
    <font-awesome-icon icon="fa-solid fa-circle-half-stroke" style="height: 2em; width: 2em" />
    <h1>{{ displayCurrency }}</h1>
    <h2>{{ symbol }} {{ value }}</h2>
    <h2> % {{ percentChange }}</h2>
    <h2> mid price </h2>
    <h2> {{ midPrice }} </h2>
  </div>
</template>

<style scoped>
#card {
  background: #dfc2f2;
  background-image: linear-gradient(to right, #ffffb3, #ffe6e6);
  background-attachment: fixed;
  background-size: cover;

  box-shadow: 0 15px 30px 1px grey;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
  justify-content: center;
  justify-items: center;
  border-radius: 5px;
  overflow: hidden;
  margin: 5% 10px 5% 10px;
  width: 90%;
  /* height: 150px; */
  padding: 7px 10px 5px 10px;
}
</style>
