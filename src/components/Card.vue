<script>
export default {
    props: [
        'tradingCurrencies',
        'symbol',
    ],
    data() {
        return {
            displayCurrency: this.tradingCurrencies.replace("-", "/").toUpperCase(),
            value: 0
        }
    },
    created() {
        new WebSocket('wss://stream.binance.com:9443/ws/' + this.tradingCurrencies.replace("-", "") + '@miniTicker')
        .addEventListener('message', e => {
            let data = JSON.parse(e.data) || {};
            let { s, c } = data;

            this.value = Number(c).toFixed(2);
        });
    }
}
</script>

<template>
  <div id="card">
    <font-awesome-icon
      icon="fa-solid fa-circle-half-stroke"
      style="height: 2em; width: 2em"
    />
    <h1>{{ displayCurrency }}</h1>
    <h2>{{ symbol }} {{ value }}</h2>
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
