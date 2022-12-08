<script>
import Card from "./components/card.vue"
import { UserController } from './server/controller/user.controller';

let userController = new UserController("config")
let userTaco = userController.createNewUser("Taco")

export default {
  components: {
    Card
  },
  data() {
    return {
      userId: userTaco,
      user: userController,
      currency: {
        BTCUSD: null,
        ETHUSD: null,
        ETHBTC: null,
      },
      buy: {
        currency: "btc-usd",
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0
      },
      sell: {
        currency: "btc-usd",
        // cuurency to paid
        quoteAsset: 0,
        // currency that will get
        baseAsset: 0
      }
    }
  },
  created() {
    function connectToWebSocket(currency) {

      return new WebSocket('wss://stream.binance.com:9443/ws/' + currency + '@miniTicker');
    }

    connectToWebSocket("btcusdt").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.BTCUSD = Number(c).toFixed(2);
    });

    connectToWebSocket("ethusdt").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.ETHUSD = Number(c).toFixed(2);
    });

    connectToWebSocket("ethbtc").addEventListener('message', e => {

      let data = JSON.parse(e.data) || {};
      let { s, c } = data;

      this.currency.ETHBTC = Number(c).toFixed(2);
    });


  },
  computed: {
  },
  mounted() {

  },
  methods: {
    rateDeterminer(currency) {
      switch (currency) {
        case "btc-usd":
          return this.currency.BTCUSD
        case "eth-usd":
          return this.currency.ETHUSD
      }
    },
    buyCoin(currency, quoteAsset) {
      console.log("Buy " + currency + " for " + quoteAsset)
      const rate = this.rateDeterminer(currency)
      this.buy.baseAsset = (quoteAsset / Number(rate)).toFixed(5)
    },
    sellCoin(currency, quoteAsset) {
      console.log("Sell " + currency + " for " + quoteAsset)
      const rate = this.rateDeterminer(currency)
      this.sell.baseAsset = (quoteAsset * Number(rate)).toFixed(5)
    },
    commitTransaction(currency, quoteAsset, baseAsset, flag) {
      const baseQuoteCurrencies = currency.split("-")
      const balance = this.user.getBalace(this.userId)

      let quoteCurrency, baseCurrency
      if (flag === "buy") {
        quoteCurrency = baseQuoteCurrencies[1]
        baseCurrency = baseQuoteCurrencies[0]

        this.buy.quoteAsset = 0
        this.buy.baseAsset = 0
      } else if (flag === "sell") {
        quoteCurrency = baseQuoteCurrencies[0]
        baseCurrency = baseQuoteCurrencies[1]

        this.sell.quoteAsset = 0
        this.sell.baseAsset = 0

      }

      if (balance[quoteCurrency]["amount"] >= quoteAsset) {
        console.log({
          "currency": currency,
          "quote": quoteAsset,
          "base": baseAsset
        })
        this.user.updateUserBalance(this.userId, quoteCurrency, balance[quoteCurrency]["amount"] - quoteAsset)
        this.user.updateUserBalance(this.userId, baseCurrency, balance[baseCurrency]["amount"] + baseAsset)
      }
      else {
        console.log("Not enough funds!!!")
      }

      console.log(this.user.getBalace(this.userId))
    }

  }
}
</script>

<template>
  <div class="row" style="width: 100%; height: 20%;">
    <!-- <div class="col" style="">
      <div id="card">
        <font-awesome-icon icon="fa-solid fa-circle-half-stroke" style="height: 2em; width: 2em;" />
        <h1>BTC/USD</h1>
        <h2>$ {{ currency.BTCUSD }}</h2>
      </div>
    </div>
    
    <div class="col" style="">
      <div id="card">
        <font-awesome-icon icon="fa-solid fa-circle-half-stroke" style="height: 2em; width: 2em;" />
        <h1>ETH/USD</h1>
        <h2>$ {{ currency.ETHUSD }}</h2>
      </div>

    </div>
    <div class="col" style="">
      <div id="card">
        <font-awesome-icon icon="fa-solid fa-circle-half-stroke" style="height: 2em; width: 2em;" />
        <h1>ETH/BTC</h1>
        <h2>B {{ currency.ETHBTC }}</h2>
      </div>

    </div> -->
    <div class="col" style="">
      <Card :tradingCurrencies="'BTC/USD'" :symbol="'$'" :value="currency.BTCUSD"/>
    </div>
    <div class="col" style="">
      <Card :tradingCurrencies="'ETH/USD'" :symbol="'$'" :value="currency.ETHUSD"/>
    </div>
    <div class="col" style="">
      <Card :tradingCurrencies="'ETH/BTC'" :symbol="'B'" :value="currency.ETHBTC"/>
    </div>
  </div>
  <div class="row" style="width: 100%; ">
    <div class="col">

      <div id="transactor">
        <select required name="currency" v-model="buy.currency">
          <option value="btc-usd">BTC/USD</option>
          <option value="eth-usd">ETH/USD</option>
          <option value="eth-btc">ETH/BTC</option>
        </select>
        <br>
        <br>
        <p>Buy: {{ buy.quoteAsset }} {{ buy.currency.split("-")[1] }}</p>
        <input type="number" v-model.number="buy.quoteAsset" @change="buyCoin(buy.currency, buy.quoteAsset)" />
        <br>
        <br>
        <p>Got: {{ buy.baseAsset }} {{ buy.currency.split("-")[0] }}</p>
        <br>
        <button class="btn btn-outline-dark"
          @click="commitTransaction(buy.currency, buy.quoteAsset, buy.baseAsset, 'buy')">Confirm</button>
      </div>
    </div>
    <div class="col">
      <div id="transactor">
        <select required name="currency" v-model="sell.currency">
          <option value="btc-usd">BTC/USD</option>
          <option value="eth-usd">ETH/USD</option>
          <option value="eth-btc">ETH/BTC</option>
        </select>
        <br>
        <br>
        <p>Sell: {{ sell.quoteAsset }} {{ sell.currency.split("-")[0] }}</p>
        <input type="number" v-model.number="sell.quoteAsset" @change="sellCoin(sell.currency, sell.quoteAsset)" />
        <br>
        <br>
        <p>Got: {{ sell.baseAsset }} {{ sell.currency.split("-")[1] }}</p>
        <br>
        <button class="btn btn-outline-dark"
          @click="commitTransaction(sell.currency, sell.quoteAsset, sell.baseAsset, 'sell')">Confirm</button>
      </div>
    </div>
  </div>
  <div class="row" style="width: 100%;">
    <div id="card">
      <p>
        {{ this.user.getUserData(userId) }}
      </p>
      <p>
        {{ this.user.getBalace(userId) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
#transactor {
  background: #DFC2F2;
  background-image: linear-gradient(to right, #ffffb3, #ffe6e6);
  background-attachment: fixed;
  background-size: cover;

  box-shadow: 0 15px 30px 1px grey;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 5px;
  overflow: hidden;
  margin: 5% auto 5% auto;
  max-width: 80%;
  padding: 5%;
}
</style>
